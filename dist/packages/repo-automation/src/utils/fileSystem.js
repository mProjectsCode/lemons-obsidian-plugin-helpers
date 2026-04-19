import { readFileSync } from 'node:fs';
import path from 'node:path';
export const defaultFileSystem = {
    cwd: () => process.cwd(),
    join: (...parts) => path.join(...parts),
    resolve: (...parts) => path.resolve(...parts),
    exists: async (filePath) => Bun.file(filePath).exists(),
    readText: async (filePath) => Bun.file(filePath).text(),
    readTextSync: (filePath) => readFileSync(filePath, 'utf8'),
    writeText: async (filePath, content) => {
        await Bun.write(filePath, content);
    },
};
export class MemoryFileSystem {
    files = new Map();
    currentWorkingDirectory;
    constructor(initialFiles, cwd = '/') {
        this.currentWorkingDirectory = this.normalize(cwd);
        if (initialFiles !== undefined) {
            for (const [filePath, content] of Object.entries(initialFiles)) {
                this.files.set(this.normalize(filePath), content);
            }
        }
    }
    cwd() {
        return this.currentWorkingDirectory;
    }
    join(...parts) {
        return this.normalize(path.posix.join(...parts));
    }
    resolve(...parts) {
        return this.normalize(path.posix.resolve(this.currentWorkingDirectory, ...parts));
    }
    async exists(filePath) {
        return this.files.has(this.normalize(filePath));
    }
    async readText(filePath) {
        const normalizedPath = this.normalize(filePath);
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
            throw new Error(`file not found: ${normalizedPath}`);
        }
        return content;
    }
    readTextSync(filePath) {
        const normalizedPath = this.normalize(filePath);
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
            throw new Error(`file not found: ${normalizedPath}`);
        }
        return content;
    }
    async writeText(filePath, content) {
        this.files.set(this.normalize(filePath), content);
    }
    setFile(filePath, content) {
        this.files.set(this.normalize(filePath), content);
    }
    getFile(filePath) {
        return this.files.get(this.normalize(filePath));
    }
    normalize(filePath) {
        const normalized = filePath.replace(/\\/g, '/');
        return path.posix.normalize(normalized.startsWith('/') ? normalized : `/${normalized}`);
    }
}
