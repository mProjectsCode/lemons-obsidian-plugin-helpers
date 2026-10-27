# Lemons Obsidian plugin packages

Three independently versioned packages share this repository:

| Package                                         | Source                     | Purpose                                                               |
| ----------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| `@lemons_dev/lemons-obsidian-plugin-helpers`    | `packages/helpers`         | Runtime helpers                                                       |
| `@lemons_dev/lemons-obsidian-plugin-automation` | `packages/repo-automation` | Plugin builds, artifact validation, packaging and release preparation |
| `@lemons_dev/eslint-config-obsidian`            | `packages/eslint-config`   | Development/review lint profiles and Prettier defaults                |

All three packages use the MIT license. Consumers install versioned GitHub release tarballs and commit their lockfiles. The current tooling releases are automation 0.2.8 and lint configuration 0.1.5. Update consumers manually: change the exact release URL, refresh and commit the lockfile, then run `bun run verify`. Repositories may adopt releases independently; there is no portfolio upgrade tool. Runtime dependencies remain separate from development tooling.

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

The consumer workflow is:

- `bun run dev` watches and builds into `exampleVault/.obsidian/plugins/<manifest-id>`. Open that vault in Obsidian and use the configured reload hotkey to see changes. The watcher does not typecheck; editor/LSP diagnostics provide feedback while editing.
- `bun run check` checks formatting, types, lint and tests, including Svelte/API checks where applicable.
- `bun run verify` runs those checks, builds production output and validates it.
- `bun run package` builds fresh production output and creates the install zip; it also packs API packages where applicable. Run `verify` separately when checks are needed.
- `bun run lint:review` captures independent advisory scanner findings, including accepted CI exceptions.
- `bun run release:prepare` verifies a clean development branch and prepares version metadata.

The lower-level `lemons-automation package` command archives existing validated `dist` files. Release CI calls it immediately after `verify` to avoid building twice. API packages are built and packed after the plugin build clears `dist`. Packaging requires the `zip` executable on PATH; archive inspection in tooling tests also uses `unzip`.

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

`lemons-automation release:prepare` requires a clean development branch, verifies the repository and prepares stable/canary version metadata for review. Preconditions that change tracked or untracked work fail without staging or committing it. Checks stream their stdout and stderr as they run, preserving the child process output and colors. A final status reports success or failure. Review and commit the metadata changes, then publish explicitly. The legacy `release` CLI alias also performs preparation only.

After version selection, preparation looks for a `CHANGELOG.md` entry for that exact version, or a single `Unreleased` entry as a fallback. It displays the selected notes and asks for confirmation before changing the changelog or any version metadata. A fallback heading is renamed to the selected version, including for canaries; stable metadata stays unchanged for canaries. Duplicate matching headings fail. Supported Markdown headings use `#` through `######`, plain or bracketed versions (optionally prefixed with `v`), or `Unreleased`; version headings can include ` - YYYY-MM-DD`. Entries end at the next heading of the same or higher level, and nested headings and fenced examples are preserved. An exact version entry takes precedence over `Unreleased`.

If the file or matching entry is missing, or the selected entry is empty, preparation offers **Continue without release notes** or **Cancel release**. Continuing creates an empty version entry if needed, preserving existing changelog history. Canceling leaves the changelog and all version metadata untouched. This is an interactive decision; no flag is required.

In release CI, run `bun x --no-install lemons-automation release:notes` with `RELEASE_TAG` set to the tag and `RELEASE_NOTES_PATH` set to a file under the runner temporary directory. This uses the same parser, requires the exact finalized version heading, and writes only that entry's body. Pass that file to `softprops/action-gh-release` as `body_path`. CI never renames or falls back to `Unreleased`. An exact but empty version entry produces an empty release body; a missing file or matching heading still fails. Commit the version entry created by local preparation so CI can identify an explicitly approved empty release.

For a stable plugin release, prepare the version, review and commit the resulting metadata, then create and push a tag matching `manifest.json` (for example `0.7.8`). For a canary, preparation leaves stable metadata unchanged: tag the verified commit with the printed same-base canary version (for example `0.7.7-canary.<timestamp>`). Push the tag explicitly. The workflow checks the tag, derives the canary manifest in its disposable checkout, verifies and packages the plugin, and publishes canaries as prereleases. Do not add the shared-package tag prefixes to plugin tags.

Prepare a shared package version with:

```bash
bun run release:package
```

This updates the chosen package's version for review. After verification, explicitly commit and create the matching `helpers-v<version>`, `automation-v<version>`, or `eslint-config-v<version>` tag. The release workflow verifies the tagged source and package version, packs the matching package, and attaches its tarball to a GitHub release. It uses the repository GITHUB_TOKEN with contents write permission; npm credentials are unnecessary. The tagged GitHub workflow is the publication path; local preparation does not publish.

Install from the exact asset URL, for example:

```bash
bun add --dev https://github.com/mProjectsCode/lemons-obsidian-plugin-helpers/releases/download/automation-v0.2.8/automation-v0.2.8.tgz
bun add --dev https://github.com/mProjectsCode/lemons-obsidian-plugin-helpers/releases/download/eslint-config-v0.1.5/eslint-config-v0.1.5.tgz
```

These are packed packages with built exports, rather than GitHub source archives. Ordinary transitive dependencies still resolve from npm. Publish each version once; retain the consumer lockfile integrity checks. Before publishing, the tag must point to a reviewed commit containing the complete tooling implementation.
