import { PluginInfo } from '@croffledev/croffle-common';

export const validatePluginInstallation = (data: Partial<PluginInfo>): void => {
  if (!data.name) {
    throw new Error('[PluginInfo] Plugin name is required for installation.');
  }

  if (!data.version) {
    throw new Error('[PluginInfo] Plugin version is required for installation.');
  }

  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('[PluginInfo] Invalid plugin name provided.');
  }

  if (typeof data.version !== 'string') {
    throw new Error('[PluginInfo] Invalid plugin version provided.');
  }

  if (data.author !== undefined && typeof data.author !== 'string') {
    throw new Error('[PluginInfo] Author must be a string if provided.');
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    throw new Error('[PluginInfo] Description must be a string if provided.');
  }

  if (data.enabled !== undefined && typeof data.enabled !== 'boolean') {
    throw new Error('[PluginInfo] Enabled flag must be a boolean if provided.');
  }
};
