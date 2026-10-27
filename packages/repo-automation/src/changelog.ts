import type { FileSystem } from './utils/fileSystem';
import { defaultFileSystem } from './utils/fileSystem';
import { UserError } from './utils/utils';
import { parseVersion } from './utils/versionUtils';

interface Heading {
	start: number;
	end: number;
	level: number;
	title: string;
	titleStart: number;
}

export interface ChangelogEntry {
	notes: string;
	/** The complete changelog, with Unreleased renamed when used as a fallback. */
	content: string;
}

// ATX headings outside fenced code blocks. Offsets preserve the original file and line endings.
function headings(content: string): Heading[] {
	const result: Heading[] = [];
	let offset = 0;
	let fence: string | undefined;
	for (const line of content.split(/(?<=\n)/)) {
		const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)/.exec(line);
		if (fence !== undefined) {
			if (fenceMatch?.[1].startsWith(fence[0]) && fenceMatch[1].length >= fence.length && !fenceMatch[2].trim()) {
				fence = undefined;
			}
		} else if (fenceMatch) {
			fence = fenceMatch[1];
		} else {
			const match = /^( {0,3}#{1,6}[ \t]+)(.*?)[ \t]*(?:\r?\n)?$/.exec(line);
			if (match) {
				result.push({
					start: offset,
					end: offset + line.length,
					level: match[1].trim().length,
					title: match[2].replace(/[ \t]+#+$/, '').trim(),
					titleStart: offset + match[1].length,
				});
			}
		}
		offset += line.length;
	}
	return result;
}

function releaseLabel(title: string): string | undefined {
	// Plain or Keep a Changelog headings, optionally prefixed with v and followed by a date.
	return /^(?:\[(Unreleased|v?\d+\.\d+\.\d+(?:-canary\.\d{8}T\d{6})?)\]|(Unreleased|v?\d+\.\d+\.\d+(?:-canary\.\d{8}T\d{6})?))(?:[ \t]+[-–—][ \t]+\d{4}-\d{2}-\d{2})?$/i
		.exec(title)
		?.slice(1)
		.find(Boolean)
		?.replace(/^v/i, '')
		.toLowerCase();
}

export function selectChangelogEntry(content: string, version: string, allowUnreleased = false): ChangelogEntry {
	parseVersion(version);
	const all = headings(content);
	const exact = all.filter(heading => releaseLabel(heading.title) === version.toLowerCase());
	const candidates = exact.length > 0 || !allowUnreleased ? exact : all.filter(heading => releaseLabel(heading.title) === 'unreleased');
	if (candidates.length !== 1) {
		throw new UserError(
			`CHANGELOG.md must contain exactly one heading for ${version}${allowUnreleased ? ' or a single Unreleased fallback' : ''}; found ${candidates.length}`,
		);
	}
	const heading = candidates[0];
	const end = all.find(next => next.start > heading.start && next.level <= heading.level)?.start ?? content.length;
	const notes = content.slice(heading.end, end).trim();
	if (!notes) {
		throw new UserError(`CHANGELOG.md entry for ${version} is empty`);
	}
	if (exact.length === 0) {
		const labelOffset = heading.title.toLowerCase().indexOf('unreleased');
		const start = heading.titleStart + labelOffset;
		content = content.slice(0, start) + version + content.slice(start + 'Unreleased'.length);
	}
	return { notes, content };
}

export async function readChangelogEntry(
	repoRoot: string,
	version: string,
	allowUnreleased = false,
	fileSystem: FileSystem = defaultFileSystem,
): Promise<ChangelogEntry> {
	const filename = fileSystem.join(repoRoot, 'CHANGELOG.md');
	if (!(await fileSystem.exists(filename))) {
		throw new UserError(`CHANGELOG.md not found at "${filename}"`);
	}
	return selectChangelogEntry(await fileSystem.readText(filename), version, allowUnreleased);
}

/** CI requires a finalized entry matching the tag; it never falls back to Unreleased. */
export async function writeReleaseNotes(repoRoot: string, tag: string, outputPath: string, fileSystem: FileSystem = defaultFileSystem): Promise<void> {
	const { notes } = await readChangelogEntry(repoRoot, tag, false, fileSystem);
	await fileSystem.writeText(outputPath, notes + '\n');
}
