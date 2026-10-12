# Lemons Obsidian plugin packages

Three independently versioned packages share this repository:

| Package                                         | Source                     | Purpose                                                               |
| ----------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| `@lemons_dev/lemons-obsidian-plugin-helpers`    | `packages/helpers`         | Runtime helpers                                                       |
| `@lemons_dev/lemons-obsidian-plugin-automation` | `packages/repo-automation` | Plugin builds, artifact validation, packaging and release preparation |
| `@lemons_dev/eslint-config-obsidian`            | `packages/eslint-config`   | Development/review lint profiles and Prettier defaults                |

All three packages use the MIT license. Consumers install versioned GitHub release tarballs and commit their lockfiles. Automation 0.2.4 and lint configuration 0.1.4 are prepared locally; until their releases exist, consumers retain temporary `vendor/` tarballs. After publication, replace these with the exact release URLs and remove the vendor folders. Runtime dependencies remain separate from development tooling.

## Development

Use Bun 1.4.0 and Node 25.8.0:

```bash
bun install --frozen-lockfile
bun run verify
```

The tested tooling matrix uses Vite 8.1.3, ESLint 9.39.4, TypeScript 6.0.3, typescript-eslint 8.61.1, Prettier 3.9.4, and Svelte 5.56.3 where applicable. Consumers pin TypeScript and typescript-eslint overrides to avoid mixing the upstream lint preset's older compiler with TypeScript 6 parser services. See [lint configuration](packages/eslint-config/README.md) for coverage and review-scope details.

## Plugin builds

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { createObsidianPluginConfig } from '@lemons_dev/lemons-obsidian-plugin-automation';

export default defineConfig(({ mode }) =>
	createObsidianPluginConfig({
		root: fileURLToPath(new URL('.', import.meta.url)),
		mode,
		entry: 'src/main.ts',
	}),
);
```

Add local `plugins`, `resolve`, `define`, `worker`, `target`, or `polyfilledBuiltins` options when needed. Production builds clean `dist`; development builds preserve existing files in the plugin's example-vault directory. Builds emit one CommonJS `main.js`, a copied manifest and optional `styles.css`. Validation rejects unexpected install files, missing licenses, mismatched manifests and unbundled runtime dependencies. Packaging writes an install zip under the actual manifest id in `artifacts`.

Canonical consumer commands include `check`, `verify`, `lint:review`, `package` and `release:prepare`. API packages are built and packed after the plugin build clears `dist`.

## Release preparation

Plugin repositories configure read-only preconditions:

```json
{
	"devBranch": "main",
	"releaseBranch": "release",
	"github": "https://github.com/<org>/<repo>",
	"preconditions": ["bun run verify"]
}
```

`lemons-automation release:prepare` requires a clean development branch, verifies the repository and prepares stable/canary version metadata for review. Preconditions that change tracked or untracked work fail without staging or committing it. Review and commit the metadata changes, then publish explicitly. The legacy `release` CLI alias also performs preparation only.

Prepare a shared package version with:

```bash
bun run release:package
```

This updates the chosen package's version for review. After verification, explicitly commit and create the matching `helpers-v<version>`, `automation-v<version>`, or `eslint-config-v<version>` tag. The release workflow verifies the tagged source and package version, packs the matching package, and attaches its tarball to a GitHub release. It uses the repository GITHUB_TOKEN with contents write permission; npm credentials are unnecessary. No release workflow has been executed as part of the local tooling rollout.

Install from the exact asset URL, for example:

```bash
bun add --dev https://github.com/mProjectsCode/lemons-obsidian-plugin-helpers/releases/download/automation-v0.2.4/automation-v0.2.4.tgz
bun add --dev https://github.com/mProjectsCode/lemons-obsidian-plugin-helpers/releases/download/eslint-config-v0.1.4/eslint-config-v0.1.4.tgz
```

These are packed packages with built exports, rather than GitHub source archives. Ordinary transitive dependencies still resolve from npm. Publish each version once; retain the consumer lockfile integrity checks. Before publishing, the tag must point to a reviewed commit containing the complete tooling implementation.
