export interface FileSystem {
    cwd(): string;
    join(...parts: string[]): string;
    resolve(...parts: string[]): string;
    exists(filePath: string): Promise<boolean>;
    readText(filePath: string): Promise<string>;
    readTextSync(filePath: string): string;
    writeText(filePath: string, content: string): Promise<void>;
}
export declare const defaultFileSystem: FileSystem;
export declare class MemoryFileSystem implements FileSystem {
    private readonly files;
    private currentWorkingDirectory;
    constructor(initialFiles?: Record<string, string>, cwd?: string);
    cwd(): string;
    join(...parts: string[]): string;
    resolve(...parts: string[]): string;
    exists(filePath: string): Promise<boolean>;
    readText(filePath: string): Promise<string>;
    readTextSync(filePath: string): string;
    writeText(filePath: string, content: string): Promise<void>;
    setFile(filePath: string, content: string): void;
    getFile(filePath: string): string | undefined;
    private normalize;
}
