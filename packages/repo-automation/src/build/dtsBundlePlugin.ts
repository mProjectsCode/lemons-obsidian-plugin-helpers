import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Parser } from '@lemons_dev/parsinom/lib/Parser';
import { P } from '@lemons_dev/parsinom/lib/ParsiNOM';
import type { Plugin } from 'vite';

interface DtsBundlePluginResolvedOptions {
	rootDir: string;
	sourceDir: string;
	tempDir: string;
	outputFile: string;
	modulePrefix: string;
}

export interface DtsBundlePluginOptions {
	sourceDir: string;
	tempDir: string;
	outputFile: string;
	modulePrefix: string;
}

interface RewriteContext {
	modulePrefix: string;
	sourceDirPrefix: string;
}

interface ProcessingContext {
	rewriteContext: RewriteContext;
}

interface DeclarationModule {
	moduleId: string;
	content: string;
}

type ModuleContentTransform = (content: string, moduleId: string, context: ProcessingContext) => string;
type BundleContentTransform = (content: string, context: ProcessingContext) => string;

const DECLARABLE_KEYWORDS = ['class', 'function', 'const', 'let', 'var', 'enum', 'namespace', 'interface', 'type'] as const;
const quotedSpecifierParser: Parser<{ quote: string; specifier: string }> = P.oneOf(`"'`).chain(quote =>
	P.sequenceMap((specifier, _quoteClose) => ({ quote, specifier }), P.manyNotOf(quote), P.string(quote)),
);

function normalizePathLike(value: string): string {
	return value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

function isAbsolutePathLike(value: string): boolean {
	return value.startsWith('/') || /^[A-Za-z]:[\\/]/.test(value);
}

function assertRelativePathOption(name: keyof DtsBundlePluginOptions, value: string): void {
	if (isAbsolutePathLike(value)) {
		throw new Error(`[dts-bundle-plugin] Invalid option "${name}": expected a relative path.`);
	}

	const normalized = normalizePathLike(value);
	if (normalized.length === 0) {
		throw new Error(`[dts-bundle-plugin] Invalid option "${name}": value cannot be empty.`);
	}

	const segments = normalized.split('/');
	if (segments.includes('..')) {
		throw new Error(`[dts-bundle-plugin] Invalid option "${name}": path traversal is not allowed.`);
	}
}

function assertNonEmptyOption(name: keyof DtsBundlePluginOptions, value: string): void {
	if (value.trim().length === 0) {
		throw new Error(`[dts-bundle-plugin] Invalid option "${name}": value cannot be empty.`);
	}
}

function resolveOptions(rootDir: string, options: DtsBundlePluginOptions): DtsBundlePluginResolvedOptions {
	assertNonEmptyOption('sourceDir', options.sourceDir);
	assertNonEmptyOption('tempDir', options.tempDir);
	assertNonEmptyOption('outputFile', options.outputFile);
	assertNonEmptyOption('modulePrefix', options.modulePrefix);
	assertRelativePathOption('sourceDir', options.sourceDir);
	assertRelativePathOption('tempDir', options.tempDir);
	assertRelativePathOption('outputFile', options.outputFile);

	const sourceDir = normalizePathLike(options.sourceDir);
	const tempDir = normalizePathLike(options.tempDir);
	const outputFile = normalizePathLike(options.outputFile);
	const modulePrefix = normalizePathLike(options.modulePrefix);

	if (outputFile.endsWith('/')) {
		throw new Error('[dts-bundle-plugin] Invalid option "outputFile": expected a file path, got a directory.');
	}

	if (!outputFile.endsWith('.d.ts')) {
		throw new Error('[dts-bundle-plugin] Invalid option "outputFile": expected a .d.ts file path.');
	}

	if (tempDir === sourceDir || tempDir.startsWith(`${sourceDir}/`)) {
		throw new Error('[dts-bundle-plugin] Invalid option "tempDir": must be outside sourceDir.');
	}

	return {
		rootDir,
		sourceDir,
		tempDir,
		outputFile,
		modulePrefix,
	};
}

function normalizeSpecifier(specifier: string): string {
	return specifier
		.replace(/\\/g, '/')
		.replace(/\.d\.ts$/i, '')
		.replace(/\.(d\.mts|d\.cts)$/i, '')
		.replace(/\.(ts|tsx|mts|cts)$/i, '');
}

function parseQuotedSpecifier(input: string, index: number): { quote: string; specifier: string; consumed: number } | undefined {
	if (index < 0 || index >= input.length) {
		return undefined;
	}

	const parseResult = quotedSpecifierParser.marker().tryParse(input.slice(index));
	if (!parseResult.success) {
		return undefined;
	}

	return {
		quote: parseResult.value.value.quote,
		specifier: parseResult.value.value.specifier,
		consumed: parseResult.value.range.to,
	};
}

function skipInlineWhitespace(input: string, index: number): number {
	let i = index;
	while (i < input.length) {
		const char = input[i];
		if (char === ' ' || char === '\t') {
			i += 1;
			continue;
		}

		break;
	}

	return i;
}

function replaceAt(input: string, startIndex: number, endIndex: number, replacement: string): string {
	return `${input.slice(0, startIndex)}${replacement}${input.slice(endIndex)}`;
}

function rewriteSpecifierAt(input: string, quoteStartIndex: number, currentModuleId: string, context: RewriteContext): string {
	const parsed = parseQuotedSpecifier(input, quoteStartIndex);
	if (parsed === undefined) {
		return input;
	}

	const rewrittenSpecifier = resolveModuleSpecifier(currentModuleId, parsed.specifier, context);
	if (rewrittenSpecifier === parsed.specifier) {
		return input;
	}

	const replacement = `${parsed.quote}${rewrittenSpecifier}${parsed.quote}`;
	return replaceAt(input, quoteStartIndex, quoteStartIndex + parsed.consumed, replacement);
}

function hasWordAt(input: string, startIndex: number, value: string): boolean {
	if (startIndex < 0 || startIndex + value.length > input.length) {
		return false;
	}

	if (input.slice(startIndex, startIndex + value.length) !== value) {
		return false;
	}

	const before = startIndex > 0 ? input[startIndex - 1] : undefined;
	const after = startIndex + value.length < input.length ? input[startIndex + value.length] : undefined;
	const isWordCharacter = (char: string | undefined): boolean => char !== undefined && /[A-Za-z0-9_$]/.test(char);

	return !isWordCharacter(before) && !isWordCharacter(after);
}

function rewriteFromSpecifierInLine(line: string, currentModuleId: string, context: RewriteContext): string {
	let next = line;
	let searchIndex = 0;

	while (searchIndex < next.length) {
		const fromIndex = next.indexOf('from', searchIndex);
		if (fromIndex === -1) {
			break;
		}

		if (!hasWordAt(next, fromIndex, 'from')) {
			searchIndex = fromIndex + 1;
			continue;
		}

		const quoteStart = skipInlineWhitespace(next, fromIndex + 'from'.length);
		if (quoteStart < next.length && (next[quoteStart] === '"' || next[quoteStart] === "'")) {
			next = rewriteSpecifierAt(next, quoteStart, currentModuleId, context);
		}

		searchIndex = fromIndex + 1;
	}

	return next;
}

function rewriteImportCallSpecifiersInLine(line: string, currentModuleId: string, context: RewriteContext): string {
	let next = line;
	let searchIndex = 0;

	while (searchIndex < next.length) {
		const importIndex = next.indexOf('import(', searchIndex);
		if (importIndex === -1) {
			break;
		}

		const quoteStart = skipInlineWhitespace(next, importIndex + 'import('.length);
		if (quoteStart < next.length && (next[quoteStart] === '"' || next[quoteStart] === "'")) {
			next = rewriteSpecifierAt(next, quoteStart, currentModuleId, context);
		}

		searchIndex = importIndex + 1;
	}

	return next;
}

function rewriteSideEffectImportSpecifierInLine(line: string, currentModuleId: string, context: RewriteContext): string {
	const trimmed = line.trimStart();
	if (!trimmed.startsWith('import ')) {
		return line;
	}

	if (trimmed.includes(' from ')) {
		return line;
	}

	const importIndex = line.indexOf('import');
	if (importIndex === -1) {
		return line;
	}

	const quoteStart = skipInlineWhitespace(line, importIndex + 'import'.length);
	if (quoteStart >= line.length || (line[quoteStart] !== '"' && line[quoteStart] !== "'")) {
		return line;
	}

	return rewriteSpecifierAt(line, quoteStart, currentModuleId, context);
}

function resolveModuleSpecifier(currentModuleId: string, specifier: string, context: RewriteContext): string {
	if (specifier.startsWith('.')) {
		const currentDir = path.posix.dirname(currentModuleId);
		return normalizeSpecifier(path.posix.normalize(path.posix.join(currentDir, specifier)));
	}

	if (specifier.startsWith(`${context.sourceDirPrefix}/`)) {
		return normalizeSpecifier(`${context.modulePrefix}/${specifier.slice(context.sourceDirPrefix.length + 1)}`);
	}

	if (specifier.startsWith('src/')) {
		return normalizeSpecifier(`${context.modulePrefix}/${specifier.slice(4)}`);
	}

	return specifier;
}

function applyLineTransform(content: string, transform: (line: string) => string): string {
	return content
		.split('\n')
		.map(line => transform(line))
		.join('\n');
}

function rewriteModuleSpecifiers(content: string, currentModuleId: string, context: ProcessingContext): string {
	return applyLineTransform(content, line => {
		let next = line;
		next = rewriteFromSpecifierInLine(next, currentModuleId, context.rewriteContext);
		next = rewriteImportCallSpecifiersInLine(next, currentModuleId, context.rewriteContext);
		next = rewriteSideEffectImportSpecifierInLine(next, currentModuleId, context.rewriteContext);
		return next;
	});
}

function isCssSideEffectImportLine(line: string): boolean {
	const trimmed = line.trim();
	if (!trimmed.startsWith('import ')) {
		return false;
	}

	if (trimmed.includes(' from ')) {
		return false;
	}

	const quoteIndex = trimmed.includes('"') ? trimmed.indexOf('"') : trimmed.indexOf("'");
	if (quoteIndex === -1) {
		return false;
	}

	const parsed = parseQuotedSpecifier(trimmed, quoteIndex);
	if (parsed === undefined) {
		return false;
	}

	return parsed.specifier.endsWith('.css');
}

function removeCssSideEffectImports(content: string): string {
	return content
		.split('\n')
		.filter(line => !isCssSideEffectImportLine(line))
		.join('\n');
}

function removeEmptyExportStatements(content: string): string {
	return content
		.split('\n')
		.filter(line => line.trim().replace(/\s+/g, '') !== 'export{};')
		.join('\n');
}

function startsWithDeclarableKeyword(segment: string): boolean {
	const trimmed = segment.trimStart();
	if (trimmed.startsWith('abstract ')) {
		const rest = trimmed.slice('abstract '.length);
		return DECLARABLE_KEYWORDS.some(keyword => rest.startsWith(`${keyword} `) || rest === keyword || rest.startsWith(`${keyword}<`));
	}

	return DECLARABLE_KEYWORDS.some(keyword => trimmed.startsWith(`${keyword} `) || trimmed === keyword || trimmed.startsWith(`${keyword}<`));
}

function stripNestedDeclareModifiers(content: string): string {
	return content
		.split('\n')
		.map(line => {
			const leadingWhitespaceLength = line.length - line.trimStart().length;
			const leadingWhitespace = line.slice(0, leadingWhitespaceLength);
			let remainder = line.slice(leadingWhitespaceLength);

			if (remainder.startsWith('export declare ')) {
				const afterDeclare = remainder.slice('export declare '.length);
				if (startsWithDeclarableKeyword(afterDeclare)) {
					remainder = `export ${afterDeclare}`;
				}
			} else if (remainder.startsWith('declare ')) {
				const afterDeclare = remainder.slice('declare '.length);
				if (startsWithDeclarableKeyword(afterDeclare)) {
					remainder = afterDeclare;
				}
			}

			return `${leadingWhitespace}${remainder}`;
		})
		.join('\n');
}

function normalizeSourcePrefixInBundle(content: string, context: ProcessingContext): string {
	return applyLineTransform(content, line => {
		if (!line.includes('from') && !line.includes('import(') && !line.trimStart().startsWith('import ')) {
			return line;
		}

		const sourceOnlyRewriteContext: RewriteContext = {
			modulePrefix: context.rewriteContext.modulePrefix,
			sourceDirPrefix: context.rewriteContext.sourceDirPrefix,
		};

		let next = line;
		next = rewriteFromSpecifierInLine(next, '', sourceOnlyRewriteContext);
		next = rewriteImportCallSpecifiersInLine(next, '', sourceOnlyRewriteContext);
		next = rewriteSideEffectImportSpecifierInLine(next, '', sourceOnlyRewriteContext);
		return next;
	});
}

function runModuleContentPipeline(content: string, moduleId: string, context: ProcessingContext): string {
	const pipeline: ModuleContentTransform[] = [
		rewriteModuleSpecifiers,
		(current, _moduleId, _context): string => removeCssSideEffectImports(current),
		(current, _moduleId, _context): string => removeEmptyExportStatements(current),
		(current, _moduleId, _context): string => stripNestedDeclareModifiers(current),
	];

	let next = content;
	for (const transform of pipeline) {
		next = transform(next, moduleId, context);
	}

	return next.trimEnd();
}

function runBundleContentPipeline(content: string, context: ProcessingContext): string {
	const pipeline: BundleContentTransform[] = [normalizeSourcePrefixInBundle, (current, _context): string => removeCssSideEffectImports(current)];

	let next = content;
	for (const transform of pipeline) {
		next = transform(next, context);
	}

	return next;
}

async function collectDtsFiles(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const absPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectDtsFiles(absPath)));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.d.ts')) {
			files.push(absPath);
		}
	}

	return files;
}

async function runTsc(projectPath: string, cwd: string): Promise<void> {
	const tscJsPath = path.resolve(cwd, 'node_modules/typescript/lib/tsc.js');

	await fs.access(tscJsPath);

	await new Promise<void>((resolve, reject) => {
		const child = spawn(process.execPath, [tscJsPath, '--project', projectPath], {
			cwd,
			stdio: 'inherit',
		});

		child.on('error', reject);
		child.on('close', code => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(new Error(`tsc exited with code ${code}`));
		});
	});
}

function renderDeclarationBundle(declarations: DeclarationModule[], options: Pick<DtsBundlePluginResolvedOptions, 'modulePrefix' | 'sourceDir'>): string {
	const rewriteContext: RewriteContext = {
		modulePrefix: options.modulePrefix,
		sourceDirPrefix: options.sourceDir,
	};

	const orderedDeclarations = [...declarations].sort((a, b) => a.moduleId.localeCompare(b.moduleId));
	const moduleBlocks: string[] = [];
	let hasIndexModule = false;

	for (const declaration of orderedDeclarations) {
		const rewritten = runModuleContentPipeline(declaration.content, declaration.moduleId, { rewriteContext });
		if (!rewritten.trim()) {
			continue;
		}

		if (declaration.moduleId === `${options.modulePrefix}/index`) {
			hasIndexModule = true;
		}

		const indentedBody = rewritten
			.split('\n')
			.map(line => (line.length > 0 ? `  ${line}` : line))
			.join('\n');

		moduleBlocks.push(`declare module "${declaration.moduleId}" {\n${indentedBody}\n}`);
	}

	if (moduleBlocks.length === 0) {
		throw new Error('No declaration files were generated for bundling.');
	}

	if (hasIndexModule) {
		moduleBlocks.push(`declare module "${options.modulePrefix}" {\n  export * from "${options.modulePrefix}/index";\n}`);
	}

	let bundledContent = `${moduleBlocks.join('\n\n')}\n`;
	bundledContent = runBundleContentPipeline(bundledContent, { rewriteContext });

	return bundledContent;
}

async function bundleTypes(options: DtsBundlePluginResolvedOptions): Promise<void> {
	const tempTsConfigPath = path.join(options.rootDir, `.tsconfig.types.generated.${process.pid}.json`);
	const sourceTsGlob = `${options.sourceDir.replace(/\\/g, '/')}/**/*.{ts,tsx,mts,cts}`;
	const sourceDtsGlob = `${options.sourceDir.replace(/\\/g, '/')}/**/*.{d.ts,d.mts,d.cts}`;
	const tempOutDir = path.join(options.rootDir, options.tempDir);
	const outputFilePath = path.join(options.rootDir, options.outputFile);
	const sourceDirPath = path.join(options.rootDir, options.sourceDir);

	await fs.access(sourceDirPath);

	const tempTsConfig = {
		extends: './tsconfig.json',
		compilerOptions: {
			declaration: true,
			emitDeclarationOnly: true,
			declarationMap: false,
			stripInternal: true,
			rootDir: options.sourceDir,
			outDir: options.tempDir,
		},
		include: [sourceTsGlob, sourceDtsGlob],
		exclude: ['**/*.test.ts', '**/*.spec.ts'],
	};

	await fs.rm(tempOutDir, { recursive: true, force: true });
	await fs.writeFile(tempTsConfigPath, `${JSON.stringify(tempTsConfig, null, 2)}\n`, 'utf8');

	try {
		await runTsc(tempTsConfigPath, options.rootDir);

		const files = (await collectDtsFiles(tempOutDir)).filter(file => !file.endsWith('.d.ts.map')).sort((a, b) => a.localeCompare(b));
		const declarations: DeclarationModule[] = [];

		for (const file of files) {
			const relativeFromSource = normalizeSpecifier(path.posix.normalize(path.relative(tempOutDir, file).replace(/\\/g, '/')));
			if (!relativeFromSource || relativeFromSource.startsWith('..')) {
				continue;
			}

			const moduleId = `${options.modulePrefix}/${relativeFromSource}`;
			const content = await fs.readFile(file, 'utf8');
			declarations.push({ moduleId, content });
		}

		const bundledContent = renderDeclarationBundle(declarations, options);

		await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

		await fs.writeFile(outputFilePath, bundledContent, 'utf8');
	} finally {
		await fs.rm(tempTsConfigPath, { force: true });
		await fs.rm(tempOutDir, { recursive: true, force: true });
	}
}

export function dtsBundlePlugin(options: DtsBundlePluginOptions): Plugin {
	let rootDir = '';

	return {
		name: 'dts-bundle-plugin',
		apply: 'build',
		configResolved(config): void {
			rootDir = config.root;
		},
		async closeBundle(): Promise<void> {
			const resolvedOptions = resolveOptions(rootDir, options);
			await bundleTypes(resolvedOptions);
		},
	};
}

export const _dtsBundlePluginInternals = {
	resolveOptions,
	resolveModuleSpecifier,
	runModuleContentPipeline,
	runBundleContentPipeline,
	renderDeclarationBundle,
};
