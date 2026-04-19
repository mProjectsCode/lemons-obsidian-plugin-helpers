import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface FileSystem {
	cwd(): string;
	join(...parts: string[]): string;
	resolve(...parts: string[]): string;
	exists(filePath: string): Promise<boolean>;
	readText(filePath: string): Promise<string>;
	readTextSync(filePath: string): string;
	writeText(filePath: string, content: string): Promise<void>;
}

export const defaultFileSystem: FileSystem = {
	cwd: () => process.cwd(),
	join: (...parts: string[]) => path.join(...parts),
	resolve: (...parts: string[]) => path.resolve(...parts),
	exists: async (filePath: string) => Bun.file(filePath).exists(),
	readText: async (filePath: string) => Bun.file(filePath).text(),
	readTextSync: (filePath: string) => readFileSync(filePath, 'utf8'),
	writeText: async (filePath: string, content: string) => {
		await Bun.write(filePath, content);
	},
};

export class MemoryFileSystem implements FileSystem {
	private readonly files = new Map<string, string>();
	private currentWorkingDirectory: string;

	constructor(initialFiles?: Record<string, string>, cwd: string = '/') {
		this.currentWorkingDirectory = this.normalize(cwd);
		if (initialFiles !== undefined) {
			for (const [filePath, content] of Object.entries(initialFiles)) {
				this.files.set(this.normalize(filePath), content);
			}
		}
	}

	public cwd(): string {
		return this.currentWorkingDirectory;
	}

	public join(...parts: string[]): string {
		return this.normalize(path.posix.join(...parts));
	}

	public resolve(...parts: string[]): string {
		return this.normalize(path.posix.resolve(this.currentWorkingDirectory, ...parts));
	}

	public async exists(filePath: string): Promise<boolean> {
		return this.files.has(this.normalize(filePath));
	}

	public async readText(filePath: string): Promise<string> {
		const normalizedPath = this.normalize(filePath);
		const content = this.files.get(normalizedPath);
		if (content === undefined) {
			throw new Error(`file not found: ${normalizedPath}`);
		}

		return content;
	}

	public readTextSync(filePath: string): string {
		const normalizedPath = this.normalize(filePath);
		const content = this.files.get(normalizedPath);
		if (content === undefined) {
			throw new Error(`file not found: ${normalizedPath}`);
		}

		return content;
	}

	public async writeText(filePath: string, content: string): Promise<void> {
		this.files.set(this.normalize(filePath), content);
	}

	public setFile(filePath: string, content: string): void {
		this.files.set(this.normalize(filePath), content);
	}

	public getFile(filePath: string): string | undefined {
		return this.files.get(this.normalize(filePath));
	}

	private normalize(filePath: string): string {
		const normalized = filePath.replace(/\\/g, '/');
		return path.posix.normalize(normalized.startsWith('/') ? normalized : `/${normalized}`);
	}
}
