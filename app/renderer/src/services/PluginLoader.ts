import type { PluginContext, PluginInfo } from 'croffle';

class PluginLoader {
  private activePlugins = new Map<string, unknown>();

  public async init() {
    try {
      const enabledPlugins = await window.croffle.base.pluginInfo.getEnabled();

      for (const plugin of enabledPlugins) {
        await this.loadPlugin(plugin);
      }
    } catch (error) {
      console.error('Failed to load plugins', error);
    }
  }

  private async loadPlugin(plugin: PluginInfo) {
    try {
      const entryUrl = `plugin://${plugin.id}/${plugin.main}`;

      const pluginModule = await import(entryUrl);

      if (pluginModule && typeof pluginModule.activated === 'function') {
        const context = this.createContext(plugin);
        await pluginModule.activated(context);
        this.activePlugins.set(plugin.id, pluginModule);
        console.log(`Plugin ${plugin.name} loaded successfully`);
      }
    } catch (error) {
      console.error(`Failed to load plugin ${plugin.name}`, error);
    }
  }

  private createContext(plugin: PluginInfo): PluginContext {
    return {
      core: window.croffle.base,
      app: window.croffle.app,
      enums: window.croffle.enums,
      ui: {
        registerView: (viewId, renderFn) => {
          window.dispatchEvent(
            new CustomEvent('plugin:register-view', {
              detail: { pluginId: plugin.id, viewId, renderFn },
            })
          );
        },
        registerContextMenu: (target, command, label, callback) => {
          window.dispatchEvent(
            new CustomEvent('plugin:register-context-menu', {
              detail: { pluginId: plugin.id, target, command, label, callback },
            })
          );
        },
      },
    };
  }
}

export const pluginLoader = new PluginLoader();
