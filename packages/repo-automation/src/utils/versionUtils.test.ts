import { describe, expect, it } from 'bun:test';
import { CanaryVersion, Version, getIncrementOptions, parseVersion, stringifyVersion } from './versionUtils';

describe('versionUtils', () => {
	it('parses and stringifies stable versions', () => {
		const version = parseVersion('1.2.3');

		expect(version).toBeInstanceOf(Version);
		expect(version).not.toBeInstanceOf(CanaryVersion);
		expect(stringifyVersion(version)).toBe('1.2.3');
	});

	it('parses and stringifies canary versions', () => {
		const version = parseVersion('1.2.3-canary.20260101T120000');

		expect(version).toBeInstanceOf(CanaryVersion);
		expect(stringifyVersion(version)).toBe('1.2.3-canary.20260101T120000');
	});

	it('creates major, minor, patch and canary increment options', () => {
		const options = getIncrementOptions(new Version(2, 5, 9));

		expect(options).toHaveLength(4);
		expect(stringifyVersion(options[0])).toBe('3.0.0');
		expect(stringifyVersion(options[1])).toBe('2.6.0');
		expect(stringifyVersion(options[2])).toBe('2.5.10');
		expect(options[3]).toBeInstanceOf(CanaryVersion);
		expect(stringifyVersion(options[3])).toMatch(/^2\.5\.9-canary\.\d{8}T\d{6}$/);
	});
});
