import type { ExtensionInfo } from '../models/extension';

export interface ExtensionInfoApi {
  getInstalled(): Promise<ExtensionInfo[]>;
  getEnabled(): Promise<ExtensionInfo[]>;
  getByName(name: string): Promise<ExtensionInfo | null>;
  install(data: Partial<ExtensionInfo>): Promise<ExtensionInfo>;
  installFromLocal(): Promise<ExtensionInfo | null>;
  toggle(name: string, enable: boolean): Promise<ExtensionInfo | null>;
  uninstall(name: string): Promise<boolean>;
}

/** Extension-scoped configuration (persisted via storage) */
export interface ExtensionConfigurationApi {
  get<T = Record<string, unknown>>(extensionId: string, storageKey?: string): Promise<T>;
  set(extensionId: string, values: Record<string, unknown>, storageKey?: string): Promise<void>;
}

export interface ExtensionStorageApi {
  get(extensionId: string, key: string): Promise<string | null>;
  set(extensionId: string, key: string, value: string): Promise<void>;
}

export interface ExtensionSessionApi {
  get<T = unknown>(extensionId: string, key: string): Promise<T | null>;
  set<T = unknown>(extensionId: string, key: string, value: T): Promise<void>;
  delete(extensionId: string, key: string): Promise<boolean>;
  clear(extensionId: string): Promise<void>;
  clearAll(): Promise<void>;
}

export interface ExtensionsApi {
  info: ExtensionInfoApi;
  configuration: ExtensionConfigurationApi;
  storage: ExtensionStorageApi;
  session: ExtensionSessionApi;
}

/** @deprecated Use ExtensionInfoApi */
export type PluginInfoApi = ExtensionInfoApi;
/** @deprecated Use ExtensionConfigurationApi */
export type PluginSettingsApi = ExtensionConfigurationApi;
/** @deprecated Use ExtensionStorageApi */
export type PluginStorageApi = ExtensionStorageApi;
/** @deprecated Use ExtensionSessionApi */
export type PluginSessionApi = ExtensionSessionApi;
/** @deprecated Use ExtensionSessionApi */
export type PluginSessionAPI = ExtensionSessionApi;
/** @deprecated Use ExtensionsApi */
export type PluginsApi = ExtensionsApi;
