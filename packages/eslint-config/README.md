# Shared Obsidian lint configuration

Use `createCIConfig({ root, host, workers, svelteConfig, overrides })` in `eslint.config.mjs`. Include development sources and tools in `tsconfig.eslint.json`; this keeps typed coverage explicit without broad default-project fallbacks. Tests may remain in that TypeScript project for type checking, but CI lint excludes test/spec filenames, test directories, mocks, test utilities and end-to-end tests. Test execution and type checking remain separate checks. Optional `svelteConfig` enables Svelte parser and recommended rules. Provide all host directories explicitly; pure core/API/tools retain TypeScript/security checks without host-specific rules. Worker globals and timer handling are explicit.

Use `createReviewConfig({ root })` in `eslint.review.config.mjs`. This profile accepts no consumer rule exceptions and follows the upstream documented scanner exclusions, disabled rules and six security error severities; other enabled rules become warnings. It uses scanner-style project discovery. It does not certify the live directory review, which may change independently. Specification: https://github.com/obsidianmd/eslint-plugin/blob/837b01dc1647cb3f0c532becb60ea83bec137656/docs/configuration.md. Preset version: 0.4.2.

`lint` gates CI with `--max-warnings=0`. `lint:review` preserves advisory warning semantics. Store exceptions in the consumer CI config with scope and rationale; shared source suppression comments affect both profiles and are discouraged. Existing findings should be recorded before fixes; never automatically disable every reported rule.

The `./prettier` export supplies common formatting defaults. Consumers retain intentional width differences and add Svelte formatting where needed.

Consumers must pin `overrides: { "typescript": "6.0.3", "typescript-eslint": "8.61.1" }`. The upstream preset depends on TypeScript 5.4.5 internally; combining its old TypeFlags with a TypeScript 6 parser can crash typed rules. The tested override provides one compiler throughout the lint graph.

The review profile additionally excludes `exampleVault/`, whose contents are examples rather than plugin implementation. `generated` may list verified generated source (for example OpenAPI output); it does not accept rule overrides. These local scope differences from the documented generic scanner list are explicit and do not certify the live scan.

CI explicitly parses `manifest.json` with TypeScript's JSON AST and plain LICENSE files with the pinned upstream text parser. The upstream copyright rule currently recognizes the exact filename `LICENSE`; artifact validation additionally requires a nonempty `LICENSE`, `LICENSE.md`, or `LICENSE.txt`. Package metadata uses the recommended dependency validation. Review leaves manifest/license rules disabled as documented by the scanner. Internal text-parser compatibility is covered by package tests.
