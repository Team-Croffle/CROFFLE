import type { ExtensionInfo } from '@croffledev/croffle-types';

export const validateExtensionInstallation = (data: Partial<ExtensionInfo>): void => {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('[ExtensionInfo] Extension name is required for installation.');
  }

  if (!data.version || typeof data.version !== 'string') {
    throw new Error('[ExtensionInfo] Extension version is required for installation.');
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

export const validateExtensionToggle = (name: unknown, enable: unknown): void => {
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('[ExtensionInfo] Invalid extension id provided for toggle.');
  }

  if (typeof enable !== 'boolean') {
    throw new Error('[ExtensionInfo] Enable status must be a boolean.');
  }
};

export const validateExtensionId = (id: unknown): void => {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('[ExtensionInfo] Invalid extension id provided.');
  }
};
