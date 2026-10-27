import { describe, expect, it } from 'bun:test';
import { readChangelogEntry, selectChangelogEntry, writeReleaseNotes } from './changelog';
import { prepareReleaseVersion } from './release';
import { MemoryFileSystem } from './utils/fileSystem';
import { parseVersion } from './utils/versionUtils';

describe('changelog selection', () => {
	it('prefers the exact version over Unreleased and excludes surrounding entries', () => {
		const content = '# Changelog\n\n# Unreleased\n\nFuture\n\n# 1.2.3\n\nSelected\n\n# 1.2.2\n\nOld\n';
		expect(selectChangelogEntry(content, '1.2.3', true)).toEqual({ notes: 'Selected', content });
	});

	it('renames only the fallback label, preserving CRLF, brackets, and the rest of the file', () => {
		const content = '# Changelog\r\n\r\n## [Unreleased]\r\n\r\n### Changes\r\n\r\n- Unreleased feature\r\n\r\n## [1.2.2] - 2026-10-25\r\n\r\nOld\r\n';
		expect(selectChangelogEntry(content, '1.2.3', true)).toEqual({
			notes: '### Changes\r\n\r\n- Unreleased feature',
			content: content.replace('[Unreleased]', '[1.2.3]'),
		});
	});

	it('supports version prefixes, dates and closing heading markers', () => {
		expect(selectChangelogEntry('# Changelog\n\n## [v1.2.3] - 2026-10-27 ##\n\nNotes\n', '1.2.3').notes).toBe('Notes');
	});

	it('ignores apparent headings in fenced code, retaining nested Markdown in the body', () => {
		const content = '# 1.2.3\n\n### Example\n\n```md\n# 1.2.3\n# Unreleased\n```\n\n~~~md\n# Other\n~~~\n\n# 1.2.2\n\nOld';
		expect(selectChangelogEntry(content, '1.2.3').notes).toBe('### Example\n\n```md\n# 1.2.3\n# Unreleased\n```\n\n~~~md\n# Other\n~~~');
	});

	it('rejects missing, empty, duplicate and prefix-only matches', () => {
		for (const content of [
			'# 1.2.30\nWrong',
			'# Unreleased\n',
			'# 1.2.3\n\n# 1.2.2\nOld',
			'# 1.2.3\nOne\n# 1.2.3\nTwo',
			'# Unreleased\nOne\n# Unreleased\nTwo',
		]) {
			expect(() => selectChangelogEntry(content, '1.2.3', true)).toThrow();
		}
	});

	it('CI requires the exact finalized stable or canary entry without changing the changelog', async () => {
		const tag = '1.2.3-canary.20261027T120000';
		const content = `# ${tag}\n\nCanary notes\n\n# 1.2.3\n\nStable notes\n`;
		const fs = new MemoryFileSystem({ '/repo/CHANGELOG.md': content });
		await writeReleaseNotes('/repo', tag, '/notes.md', fs);
		expect(fs.getFile('/notes.md')).toBe('Canary notes\n');
		await writeReleaseNotes('/repo', '1.2.3', '/notes.md', fs);
		expect(fs.getFile('/notes.md')).toBe('Stable notes\n');
		expect(fs.getFile('/repo/CHANGELOG.md')).toBe(content);
		await expect(writeReleaseNotes('/repo', '1.2.4', '/missing.md', fs)).rejects.toThrow();
		expect(await fs.exists('/missing.md')).toBe(false);
		await expect(readChangelogEntry('/missing', '1.2.3', true, fs)).rejects.toThrow('CHANGELOG.md not found');
		expect(() => selectChangelogEntry('# Unreleased\nNotes', '1.2.3')).toThrow();
	});
});

describe('release changelog safety', () => {
	const metadata = {
		'/repo/manifest.json': '{"version":"1.2.2","minAppVersion":"1.13.0"}',
		'/repo/package.json': '{"version":"1.2.2"}',
		'/repo/versions.json': '{"1.2.2":"1.13.0"}',
	};

	it('missing or invalid changelogs fail before confirmation or any metadata changes', async () => {
		for (const changelog of [undefined, '# 1.2.2\nOld', '# Unreleased\n']) {
			const fs = new MemoryFileSystem(metadata);
			if (changelog !== undefined) fs.setFile('/repo/CHANGELOG.md', changelog);
			let confirmed = false;
			await expect(
				prepareReleaseVersion(
					'/repo',
					parseVersion('1.2.3'),
					async () => {
						confirmed = true;
					},
					fs,
				),
			).rejects.toThrow();
			expect(confirmed).toBe(false);
			for (const [filename, content] of Object.entries(metadata)) expect(fs.getFile(filename)).toBe(content);
			expect(fs.getFile('/repo/CHANGELOG.md')).toBe(changelog);
		}
	});

	it('rejecting the preview leaves every file unchanged', async () => {
		const changelog = '# Unreleased\n\nNew feature\n';
		const fs = new MemoryFileSystem({ ...metadata, '/repo/CHANGELOG.md': changelog });
		await expect(
			prepareReleaseVersion(
				'/repo',
				parseVersion('1.2.3'),
				async notes => {
					expect(notes).toBe('New feature');
					throw new Error('canceled');
				},
				fs,
			),
		).rejects.toThrow('canceled');
		for (const [filename, content] of Object.entries(metadata)) expect(fs.getFile(filename)).toBe(content);
		expect(fs.getFile('/repo/CHANGELOG.md')).toBe(changelog);
	});

	it('confirmation precedes all changes and finalized notes round-trip to CI for stable and canary versions', async () => {
		for (const tag of ['1.2.3', '1.2.2-canary.20261027T120000']) {
			const fs = new MemoryFileSystem({ ...metadata, '/repo/CHANGELOG.md': '# Unreleased\n\nNew feature\n' });
			await prepareReleaseVersion(
				'/repo',
				parseVersion(tag),
				async notes => {
					expect(notes).toBe('New feature');
					for (const [filename, content] of Object.entries(metadata)) expect(fs.getFile(filename)).toBe(content);
					expect(fs.getFile('/repo/CHANGELOG.md')).toContain('# Unreleased');
				},
				fs,
			);
			await writeReleaseNotes('/repo', tag, '/notes.md', fs);
			expect(fs.getFile('/notes.md')).toBe('New feature\n');
			expect(fs.getFile('/repo/CHANGELOG.md')).toBe(`# ${tag}\n\nNew feature\n`);
			if (tag.includes('canary')) {
				for (const [filename, content] of Object.entries(metadata)) expect(fs.getFile(filename)).toBe(content);
			} else {
				expect(JSON.parse(await fs.readText('/repo/manifest.json')).version).toBe(tag);
			}
		}
	});
});
