export declare enum Verboseness {
    QUITET = 0,
    NORMAL = 1,
    VERBOSE = 2
}
export declare function $(cmd: string, cwd?: string, verboseness?: Verboseness): Promise<{
    stdout: string;
    stderr: string;
    exit: number;
}>;
export declare function $seq(cmds: string[], onError: (cmd: string, index: number) => void, onSuccess: () => void, cwd?: string, verboseness?: Verboseness): Promise<void>;
export declare function $input(message: string): Promise<string>;
export declare function $choice(message: string, options: string[]): Promise<number>;
export declare function $confirm(message: string, onReject: () => void): Promise<void>;
export declare const CMD_FMT: {
    Reset: string;
    Bright: string;
    Dim: string;
    Underscore: string;
    Blink: string;
    Reverse: string;
    Hidden: string;
    FgBlack: string;
    FgRed: string;
    FgGreen: string;
    FgYellow: string;
    FgBlue: string;
    FgMagenta: string;
    FgCyan: string;
    FgWhite: string;
    FgGray: string;
    BgBlack: string;
    BgRed: string;
    BgGreen: string;
    BgYellow: string;
    BgBlue: string;
    BgMagenta: string;
    BgCyan: string;
    BgWhite: string;
    BgGray: string;
};
