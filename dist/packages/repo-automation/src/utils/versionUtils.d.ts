import type { Parser } from '@lemons_dev/parsinom/lib/Parser';
export declare class Version {
    major: number;
    minor: number;
    patch: number;
    constructor(major: number, minor: number, patch: number);
    toString(): string;
}
export declare class CanaryVersion extends Version {
    canary: string;
    constructor(major: number, minor: number, patch: number, canary: string);
    toString(): string;
}
export declare const versionParser: Parser<Version>;
export declare function parseVersion(str: string): Version;
export declare function stringifyVersion(version: Version): string;
export declare function getIncrementOptions(version: Version): [Version, Version, Version, CanaryVersion];
