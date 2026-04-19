# lemons-obsidian-plugin-helpers

Shared library for my Obsidian plugins. Not intended for anyone else to use, but open source for transparency reasons.

## Parts

- `packages/repo-automation`: shared repo automation scripts 
- `packages/helpers`: placeholder for future helper utilities

## Use In A Plugin Repo

Install this package, then call the shared release script from your plugin `package.json`:

```json
{
	"scripts": {
		"release": "lemons-helpers release"
	}
}
```

`lemons-helpers` is exposed through the package `bin` field, so package managers place it in `node_modules/.bin` and script runners can invoke it directly.

For repo-specific branch and GitHub values, add `repo-automation.config.json` at the plugin repo root:

```json
{
	"devBranch": "main",
	"releaseBranch": "release",
	"github": "https://github.com/<org>/<repo>",
	"preconditions": ["bun run typecheck", "bun run format", "bun run lint:fix", "bun run test"]
}
```

`preconditions` controls which checks are executed before the release flow continues.

## DTS Bundle Plugin Import

Instead of importing from an internal source path, use the package export subpath:

```ts
import { dtsBundlePlugin } from 'lemons-obsidian-plugin-helpers/repo-automation';
```

Direct internal imports like `lemons-obsidian-plugin-helpers/packages/repo-automation/src/build/dtsBundlePlugin` should be avoided.
