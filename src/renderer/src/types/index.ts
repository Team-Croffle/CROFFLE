import type { FeatureContextMenu, FeatureView } from '@croffledev/croffle-types';

export type PLuginFeatureView = FeatureView & { pluginId?: string };
export type PluginFeatureContextMenu = FeatureContextMenu & { pluginId?: string };
