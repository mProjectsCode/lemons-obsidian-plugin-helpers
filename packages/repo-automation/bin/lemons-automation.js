#!/usr/bin/env bun

import { validateArtifacts, packageArtifacts } from '../dist/src/index.mjs';
import { prepareReleaseManifest, runRelease, writeReleaseNotes } from '../dist/src/release.mjs';

function printUsage() {
	console.log('lemons-automation <command>');
	console.log('');
	console.log('Commands:');
	console.log('  validate           Validate existing production files in dist');
	console.log('  package            Archive existing dist files (run bun run package for a fresh build)');
	console.log('  release:manifest   Select the tagged build manifest using RELEASE_TAG (release checkout only)');
	console.log('  release:notes      Write the tagged changelog entry using RELEASE_TAG and RELEASE_NOTES_PATH');
	console.log('  release            Check, prepare, commit, merge, tag, and push a release');
}

const [, , command] = process.argv;

if (command === undefined || command === '--help' || command === '-h') {
	printUsage();
	process.exit(0);
}

if (command === 'validate' || command === 'package') {
	try {
		const options = { root: process.cwd(), extraFiles: ['obsidian-js-engine-api.tgz', 'obsidian-safe-js-api.tgz'] };
		console.log(command === 'validate' ? validateArtifacts(options) : packageArtifacts(options));
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
} else if (command === 'release:notes' || command === 'release:manifest' || command === 'release') {
	try {
		if (command === 'release:notes' || command === 'release:manifest') {
			if (!process.env.RELEASE_TAG) {
				throw new Error('RELEASE_TAG is required');
			}
			if (command === 'release:notes') {
				if (!process.env.RELEASE_NOTES_PATH) {
					throw new Error('RELEASE_NOTES_PATH is required');
				}
				await writeReleaseNotes(process.cwd(), process.env.RELEASE_TAG, process.env.RELEASE_NOTES_PATH);
			} else {
				await prepareReleaseManifest(process.cwd(), process.env.RELEASE_TAG);
			}
		} else {
			await runRelease();
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
			process.exit(1);
		}

		console.error(error);
		process.exit(1);
	}
	process.exit(0);
} else {
	console.error(`Unknown command "${command}"`);
	printUsage();
	process.exit(1);
}
