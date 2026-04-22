# Lemons Obsidian Plugin Monorepo

This repository contains two separate npm packages.

## Packages

- `lemons-obsidian-plugin-helpers` in `packages/helpers`
- `lemons-obsidian-plugin-automation` in `packages/repo-automation`

Both packages are licensed under MIT.

## Install

Helpers package:

```bash
npm install lemons-obsidian-plugin-helpers
```

Automation package:

```bash
npm install --save-dev lemons-obsidian-plugin-automation
```

## Use The Automation CLI

Add this script in your plugin repository:

```json
{
	"scripts": {
		"release": "lemons-automation release"
	}
}
```

Then add `repo-automation.config.json` at your plugin repository root:

```json
{
	"devBranch": "main",
	"releaseBranch": "release",
	"github": "https://github.com/<org>/<repo>",
	"preconditions": ["bun run typecheck", "bun run format", "bun run lint:fix", "bun run test"]
}
```

`preconditions` controls which checks run before the release flow continues.

## Release Monorepo Packages

Use the independent release CLI from the monorepo root:

```bash
bun run release:package
```

The CLI will:

- let you choose `lemons-obsidian-plugin-helpers` or `lemons-obsidian-plugin-automation`
- let you choose the next version (major/minor/patch/custom)
- create a release commit and package-specific tag locally

Tag format used for independent publishing:

- helpers package: `helpers-v<version>`
- automation package: `automation-v<version>`

After the script finishes, push the commit and tag:

```bash
git push origin HEAD
git push origin <tag>
```

The GitHub workflow then publishes only the package matching the tag.
