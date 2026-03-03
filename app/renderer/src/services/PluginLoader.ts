import type { PluginContext, PluginInfo } from 'croffle';

class PluginLoader {
  private activePlugins = new Map<string, unknown>();

  // 플러그인 정보 초기화
  public async init() {
    try {
      // 활성화된 플러그인 가져오기(DB에서)
      const enabledPlugins = await croffle.base.pluginInfo.getEnabled();

      // 각 플러그인 로딩
      for (const plugin of enabledPlugins) {
        await this.loadPlugin(plugin);
      }
    } catch (error) {
      console.error('Failed to load plugins', error);
    }
  }

  private async loadPlugin(plugin: PluginInfo) {
    try {
      // main file = bootstrap
      if (this.activePlugins.has(plugin.id)) return;
      if (!plugin.main) return;

      // file path = plugin://~~
      const entryUrl = `plugin://${plugin.id}/${plugin.main}`;
      // import
      const pluginModule = await import(/* @vite-ignore */ entryUrl);

      // activate = like onMount()
      if (pluginModule && typeof pluginModule.activated === 'function') {
        const context = this.createContext(plugin);
        // 재밌는 것은, activated에서 registerView나 registerContextMenu를 호출하면,
        // 여러개의 view나 menu가 등록될 수 있음.
        // 하지만, rendering이 되는 것이 아니라, 렌더링을하는 "함수"를 등록하는 것임.
        // 즉, 이 작업이 SW가 시작될 때 전부 등록되더라도, 실제 렌더링은 사용자가 해당 메뉴를 클릭했을 때 일어남.
        await pluginModule.activated(context);

        // memory. 향후 Extension간 API 확장 시 사용하거나, 비활성화 시 메모리에서 해제하기 위해 사용
        this.activePlugins.set(plugin.id, { module: pluginModule });
        console.log(`Plugin ${plugin.name} loaded successfully`);
      }
    } catch (error) {
      console.error(`Failed to load plugin ${plugin.name}`, error);
    }
  }

  // context = API Bridge.
  // Extension간 dependency를 이용하면, 참조 순서를 지켜 다른 Extension의 API를 호출하도록 할 수 있음.
  private createContext(plugin: PluginInfo): PluginContext {
    return {
      ...croffle,
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
