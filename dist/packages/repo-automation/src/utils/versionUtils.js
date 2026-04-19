import { P_UTILS } from '@lemons_dev/parsinom/lib/ParserUtils';
import { P } from '@lemons_dev/parsinom/lib/ParsiNOM';
import Moment from 'moment';
import { UserError } from './utils';
export class Version {
    major;
    minor;
    patch;
    constructor(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }
    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}
export class CanaryVersion extends Version {
    canary;
    constructor(major, minor, patch, canary) {
        super(major, minor, patch);
        this.canary = canary;
    }
    toString() {
        return `${super.toString()}-canary.${this.canary}`;
    }
}
const numberParser = P_UTILS.digits()
    .map(x => Number.parseInt(x))
    .chain(x => {
    if (Number.isNaN(x)) {
        return P.fail('a number');
    }
    else {
        return P.succeed(x);
    }
});
const canaryParser = P.sequenceMap((_, c1, c2, c3) => {
    return c1 + c2 + c3;
}, P.string('-canary.'), P_UTILS.digit()
    .repeat(8, 8)
    .map(x => x.join('')), P.string('T'), P_UTILS.digit()
    .repeat(6, 6)
    .map(x => x.join('')));
export const versionParser = P.or(P.sequenceMap((major, _1, minor, _2, patch) => {
    return new Version(major, minor, patch);
}, numberParser, P.string('.'), numberParser, P.string('.'), numberParser, P_UTILS.eof()), P.sequenceMap((major, _1, minor, _2, patch, canary) => {
    return new CanaryVersion(major, minor, patch, canary);
}, numberParser, P.string('.'), numberParser, P.string('.'), numberParser, canaryParser, P_UTILS.eof()));
export function parseVersion(str) {
    const parserRes = versionParser.tryParse(str);
    if (parserRes.success) {
        return parserRes.value;
    }
    else {
        throw new UserError(`failed to parse manifest version "${str}"`);
    }
}
export function stringifyVersion(version) {
    return version.toString();
}
export function getIncrementOptions(version) {
    const moment = Moment();
    const canary = moment.utcOffset(0).format('YYYYMMDDTHHmmss');
    return [
        new Version(version.major + 1, 0, 0),
        new Version(version.major, version.minor + 1, 0),
        new Version(version.major, version.minor, version.patch + 1),
        new CanaryVersion(version.major, version.minor, version.patch, canary),
    ];
}
