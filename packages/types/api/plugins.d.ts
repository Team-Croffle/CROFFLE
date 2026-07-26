import type { PluginInfo } from '../models/plugin';

export interface PluginInfoApi {
  getInstalled(): Promise<PluginInfo[]>;
  getEnabled(): Promise<PluginInfo[]>;
  getByName(name: string): Promise<PluginInfo | null>;
  install(data: Partial<PluginInfo>): Promise<PluginInfo>;
  installFromLocal(): Promise<PluginInfo | null>;
  toggle(name: string, enable: boolean): Promise<PluginInfo | null>;
  uninstall(name: string): Promise<boolean>;
}

export interface PluginSettingsApi {
  get<T = Record<string, unknown>>(pluginId: string, storageKey?: string): Promise<T>;
  set(pluginId: string, values: Record<string, unknown>, storageKey?: string): Promise<void>;
}

export interface PluginStorageApi {
  get(pluginId: string, key: string): Promise<string | null>;
  set(pluginId: string, key: string, value: string): Promise<void>;
}

export interface PluginSessionApi {
  get<T = unknown>(pluginId: string, key: string): Promise<T | null>;
  set<T = unknown>(pluginId: string, key: string, value: T): Promise<void>;
  delete(pluginId: string, key: string): Promise<boolean>;
  clear(pluginId: string): Promise<void>;
  clearAll(): Promise<void>;
}

/** @deprecated Use PluginSessionApi */
export type PluginSessionAPI = PluginSessionApi;

export interface PluginsApi {
  info: PluginInfoApi;
  settings: PluginSettingsApi;
  storage: PluginStorageApi;
  session: PluginSessionApi;
}
