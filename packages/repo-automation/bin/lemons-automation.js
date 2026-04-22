#!/usr/bin/env bun

import { runRelease } from '../dist/src/release.mjs';

function printUsage() {
	console.log('lemons-automation <command>');
	console.log('');
	console.log('Commands:');
	console.log('  release    Run the interactive release workflow');
}

const [, , command] = process.argv;

if (command === undefined || command === '--help' || command === '-h') {
	printUsage();
	process.exit(0);
}

if (command === 'release') {
	try {
		await runRelease();
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
