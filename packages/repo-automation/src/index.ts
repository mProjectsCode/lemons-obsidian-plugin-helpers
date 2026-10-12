export { dtsBundlePlugin } from './build/dtsBundlePlugin';
export type { DtsBundlePluginOptions } from './build/dtsBundlePlugin';

export { getBuildBanner } from './build/buildBanner';
export type { BuildBannerOptions } from './build/buildBanner';

export type { RepoAutomationConfig } from './release';

export { createObsidianPluginConfig, isHostExternal, validateManifest } from './build/pluginConfig';
export type { ObsidianPluginConfigOptions, ObsidianManifest } from './build/pluginConfig';
export { validateArtifacts, packageArtifacts } from './build/artifacts';
export type { ArtifactOptions } from './build/artifacts';
