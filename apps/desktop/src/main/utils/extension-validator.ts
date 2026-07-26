import type { ExtensionInfo } from '@croffledev/croffle-types';

/**
 * Validates the plugin data before installation.
 * @param data Partial plugin info data to validate before installation.
 * @throws Error if validation fails.
 */
export const validatePluginInstallation = (data: Partial<ExtensionInfo>): void => {
  if (!data.name) {
    throw new Error('[ExtensionInfo] Plugin name is required for installation.');
  }

  if (!data.version) {
    throw new Error('[ExtensionInfo] Plugin version is required for installation.');
  }

  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('[ExtensionInfo] Invalid plugin name provided.');
  }

  if (typeof data.version !== 'string') {
    throw new Error('[ExtensionInfo] Invalid plugin version provided.');
  }

  if (data.author !== undefined && typeof data.author !== 'string') {
    throw new Error('[ExtensionInfo] Author must be a string if provided.');
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    throw new Error('[ExtensionInfo] Description must be a string if provided.');
  }

  if (data.enabled !== undefined && typeof data.enabled !== 'boolean') {
    throw new Error('[ExtensionInfo] Enabled flag must be a boolean if provided.');
  }
};

/**
 * Validates the parameters for toggling a plugin's enabled status.
 * @param name Name of the plugin to toggle.
 * @param enable Boolean indicating whether to enable or disable the plugin.
 * @throws Error if validation fails.
 */
export const validatePluginToggle = (name: unknown, enable: unknown): void => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('[ExtensionInfo] Invalid plugin name provided for toggle.');
  }

  if (typeof enable !== 'boolean') {
    throw new Error('[ExtensionInfo] Enable status must be a boolean.');
  }
};

/**
 * Validates the plugin name.
 * @param name Name of the plugin to validate.
 * @throws Error if the plugin name is invalid.
 */
export const validatePluginName = (name: unknown): void => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('[ExtensionInfo] Invalid plugin name provided.');
  }
};
