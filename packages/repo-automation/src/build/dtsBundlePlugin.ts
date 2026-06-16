import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Parser } from '@lemons_dev/parsinom';
import { P } from '@lemons_dev/parsinom';
import type { Plugin } from 'vite';

interface DtsBundlePluginResolvedOptions {
	rootDir: string;
	sourceDir: string;
	tempDir: string;
	outputFile: string;
	modulePrefix: string;
	externalPackageAllowList?: string[];
	disallowedExternalImportType: 'unknown' | 'any';
}

export interface DtsBundlePluginOptions {
	sourceDir: string;
	tempDir: string;
	outputFile: string;
	modulePrefix: string;
	externalPackageAllowList?: string[];
	disallowedExternalImportType?: 'unknown' | 'any';
}

interface RewriteContext {
	modulePrefix: string;
	sourceDirPrefix: string;
	externalPackageAllowList?: readonly string[];
	disallowedExternalImportType?: 'unknown' | 'any';
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

function getSourceIncludeGlobs(sourceDir: string): string[] {
	const normalizedSourceDir = sourceDir.replace(/\\/g, '/').replace(/\/+$/, '');

	return [
		`${normalizedSourceDir}/**/*.ts`,
		`${normalizedSourceDir}/**/*.tsx`,
		`${normalizedSourceDir}/**/*.mts`,
		`${normalizedSourceDir}/**/*.cts`,
		`${normalizedSourceDir}/**/*.d.ts`,
		`${normalizedSourceDir}/**/*.d.mts`,
		`${normalizedSourceDir}/**/*.d.cts`,
	];
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

function assertExternalPackageAllowList(value: readonly string[] | undefined): void {
	if (value === undefined) {
		return;
	}

	for (const packageName of value) {
		if (packageName.trim().length === 0) {
			throw new Error('[dts-bundle-plugin] Invalid option "externalPackageAllowList": package names cannot be empty.');
		}

		if (packageName.startsWith('.') || packageName.startsWith('/')) {
			throw new Error('[dts-bundle-plugin] Invalid option "externalPackageAllowList": package names must be bare package specifiers.');
		}
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
	assertExternalPackageAllowList(options.externalPackageAllowList);

	const sourceDir = normalizePathLike(options.sourceDir);
	const tempDir = normalizePathLike(options.tempDir);
	const outputFile = normalizePathLike(options.outputFile);
	const modulePrefix = normalizePathLike(options.modulePrefix);
	const externalPackageAllowList = options.externalPackageAllowList?.map(packageName => packageName.trim());
	const disallowedExternalImportType = options.disallowedExternalImportType ?? 'unknown';

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
		externalPackageAllowList,
		disallowedExternalImportType,
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

function getBarePackageName(specifier: string, context: RewriteContext): string | undefined {
	if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith(`${context.modulePrefix}/`) || specifier === context.modulePrefix) {
		return undefined;
	}

	if (specifier.startsWith(`${context.sourceDirPrefix}/`) || specifier === context.sourceDirPrefix || specifier.startsWith('src/')) {
		return undefined;
	}

	const segments = specifier.split('/');
	if (specifier.startsWith('@')) {
		if (segments.length < 2 || segments[1] === '') {
			return specifier;
		}

		return `${segments[0]}/${segments[1]}`;
	}

	return segments[0] || undefined;
}

function isExternalPackageAllowed(specifier: string, context: RewriteContext): boolean {
	if (context.externalPackageAllowList === undefined) {
		return true;
	}

	const packageName = getBarePackageName(specifier, context);
	return packageName === undefined || context.externalPackageAllowList.includes(packageName);
}

function parseSpecifierAfterFrom(line: string): { specifier: string } | undefined {
	const fromIndex = line.lastIndexOf('from');
	if (fromIndex === -1 || !hasWordAt(line, fromIndex, 'from')) {
		return undefined;
	}

	const quoteStart = skipInlineWhitespace(line, fromIndex + 'from'.length);
	if (quoteStart >= line.length || (line[quoteStart] !== '"' && line[quoteStart] !== "'")) {
		return undefined;
	}

	const parsed = parseQuotedSpecifier(line, quoteStart);
	if (parsed === undefined) {
		return undefined;
	}

	return { specifier: parsed.specifier };
}

function splitCommaSeparatedImportNames(value: string): string[] {
	return value
		.split(',')
		.map(part => part.trim())
		.filter(Boolean);
}

function getImportedBindingNames(importClause: string): { typeAliases: string[]; namespaceAliases: string[] } {
	const typeAliases: string[] = [];
	const namespaceAliases: string[] = [];
	const clause = importClause
		.trim()
		.replace(/^type\s+/, '')
		.trim();
	const namespaceMatch = /^\*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(clause);
	if (namespaceMatch !== null) {
		namespaceAliases.push(namespaceMatch[1]);
		return { typeAliases, namespaceAliases };
	}

	const namedStart = clause.indexOf('{');
	const namedEnd = clause.lastIndexOf('}');
	const defaultPart = namedStart === -1 ? clause : clause.slice(0, namedStart).replace(/,$/, '').trim();
	const defaultMatch = /^([A-Za-z_$][\w$]*)/.exec(defaultPart);
	if (defaultMatch !== null) {
		typeAliases.push(defaultMatch[1]);
	}

	if (namedStart !== -1 && namedEnd > namedStart) {
		const namedPart = clause.slice(namedStart + 1, namedEnd);
		for (const binding of splitCommaSeparatedImportNames(namedPart)) {
			const normalizedBinding = binding.replace(/^type\s+/, '').trim();
			const aliasMatch = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(normalizedBinding);
			if (aliasMatch !== null) {
				typeAliases.push(aliasMatch[2] ?? aliasMatch[1]);
			}
		}
	}

	return { typeAliases, namespaceAliases };
}

function getExportedBindingNames(exportClause: string): string[] {
	const namedStart = exportClause.indexOf('{');
	const namedEnd = exportClause.lastIndexOf('}');
	if (namedStart === -1 || namedEnd <= namedStart) {
		return [];
	}

	return splitCommaSeparatedImportNames(exportClause.slice(namedStart + 1, namedEnd))
		.map(binding => {
			const normalizedBinding = binding.replace(/^type\s+/, '').trim();
			const aliasMatch = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(normalizedBinding);
			return aliasMatch?.[2] ?? aliasMatch?.[1] ?? '';
		})
		.filter(Boolean);
}

function makeTypeAliasLine(name: string, fallbackType: 'unknown' | 'any', exported: boolean): string {
	return `${exported ? 'export ' : ''}type ${name} = ${fallbackType};`;
}

function replaceDisallowedDynamicImportTypes(line: string, context: RewriteContext): string {
	let next = line;
	const importTypePattern = /\btypeof\s+import\(\s*(["'])([^"']+)\1\s*\)(?:\.[A-Za-z_$][\w$]*)*|\bimport\(\s*(["'])([^"']+)\3\s*\)(?:\.[A-Za-z_$][\w$]*)*/g;
	next = next.replace(
		importTypePattern,
		(match: string, _quoteA: string | undefined, specifierA: string | undefined, _quoteB: string | undefined, specifierB: string | undefined) => {
			const specifier = specifierA ?? specifierB ?? '';
			return isExternalPackageAllowed(specifier, context) ? match : (context.disallowedExternalImportType ?? 'unknown');
		},
	);

	return next;
}

function replaceDisallowedNamespaceReferences(line: string, namespaceAliases: readonly string[], fallbackType: 'unknown' | 'any'): string {
	let next = line;
	for (const namespaceAlias of namespaceAliases) {
		next = next.replace(new RegExp(`\\b${namespaceAlias}(?:\\.[A-Za-z_$][\\w$]*)+`, 'g'), fallbackType);
	}

	return next;
}

function replaceDisallowedExternalImports(content: string, _moduleId: string, context: ProcessingContext): string {
	if (context.rewriteContext.externalPackageAllowList === undefined) {
		return content;
	}

	const emittedAliases = new Set<string>();
	const namespaceAliases = new Set<string>();
	const lines = content.split('\n');
	const transformedLines: string[] = [];

	for (const line of lines) {
		const trimmed = line.trimStart();
		const leadingWhitespace = line.slice(0, line.length - trimmed.length);
		const fromSpecifier = parseSpecifierAfterFrom(line);

		if (fromSpecifier !== undefined && !isExternalPackageAllowed(fromSpecifier.specifier, context.rewriteContext)) {
			if (trimmed.startsWith('import ')) {
				const importIndex = line.indexOf('import');
				const importClause = line.slice(importIndex + 'import'.length, line.lastIndexOf('from')).trim();
				const bindings = getImportedBindingNames(importClause);
				for (const namespaceAlias of bindings.namespaceAliases) {
					namespaceAliases.add(namespaceAlias);
				}

				for (const typeAlias of bindings.typeAliases) {
					if (!emittedAliases.has(typeAlias)) {
						transformedLines.push(
							`${leadingWhitespace}${makeTypeAliasLine(typeAlias, context.rewriteContext.disallowedExternalImportType ?? 'unknown', false)}`,
						);
						emittedAliases.add(typeAlias);
					}
				}

				continue;
			}

			if (trimmed.startsWith('export ')) {
				for (const exportedName of getExportedBindingNames(line.slice(0, line.lastIndexOf('from')))) {
					if (!emittedAliases.has(`export:${exportedName}`)) {
						transformedLines.push(
							`${leadingWhitespace}${makeTypeAliasLine(exportedName, context.rewriteContext.disallowedExternalImportType ?? 'unknown', true)}`,
						);
						emittedAliases.add(`export:${exportedName}`);
					}
				}

				continue;
			}
		}

		if (trimmed.startsWith('import ') && fromSpecifier === undefined) {
			const importIndex = line.indexOf('import');
			const quoteStart = skipInlineWhitespace(line, importIndex + 'import'.length);
			if (quoteStart < line.length && (line[quoteStart] === '"' || line[quoteStart] === "'")) {
				const parsed = parseQuotedSpecifier(line, quoteStart);
				if (parsed !== undefined && !isExternalPackageAllowed(parsed.specifier, context.rewriteContext)) {
					continue;
				}
			}
		}

		transformedLines.push(line);
	}

	return transformedLines
		.map(line =>
			replaceDisallowedNamespaceReferences(
				replaceDisallowedDynamicImportTypes(line, context.rewriteContext),
				[...namespaceAliases],
				context.rewriteContext.disallowedExternalImportType ?? 'unknown',
			),
		)
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
		replaceDisallowedExternalImports,
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

function renderDeclarationBundle(
	declarations: DeclarationModule[],
	options: Pick<DtsBundlePluginResolvedOptions, 'modulePrefix' | 'sourceDir'> &
		Partial<Pick<DtsBundlePluginResolvedOptions, 'externalPackageAllowList' | 'disallowedExternalImportType'>>,
): string {
	const rewriteContext: RewriteContext = {
		modulePrefix: options.modulePrefix,
		sourceDirPrefix: options.sourceDir,
		externalPackageAllowList: options.externalPackageAllowList,
		disallowedExternalImportType: options.disallowedExternalImportType ?? 'unknown',
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
	const sourceIncludeGlobs = getSourceIncludeGlobs(options.sourceDir);
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
		include: sourceIncludeGlobs,
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
	getSourceIncludeGlobs,
	resolveOptions,
	resolveModuleSpecifier,
	runModuleContentPipeline,
	runBundleContentPipeline,
	renderDeclarationBundle,
};
