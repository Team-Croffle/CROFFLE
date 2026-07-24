import type {
  PluginContext,
  PluginInfo,
  RegisterSettingsTabOptions,
} from '@croffledev/croffle-types';

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

  // 설치 직후 단일 플러그인을 즉시 로드
  public async loadPluginById(pluginId: string) {
    try {
      // IPC의 getByName은 name 기반 조회이므로, id 기반 검색을 위해 전체 목록을 순회합니다.
      const plugins = await croffle.base.pluginInfo.getInstalled();
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin && plugin.enabled) {
        await this.loadPlugin(plugin);
      }
    } catch (error) {
      console.error(`Failed to load plugin by id ${pluginId}`, error);
    }
  }

  private async loadPlugin(plugin: PluginInfo) {
    try {
      if (this.activePlugins.has(plugin.id)) return;

      // CSS 자동 주입 (style.css가 존재할 경우)
      try {
        const styleUrl = `plugin://${plugin.id}/style.css`;
        const res = await fetch(styleUrl, { method: 'HEAD' });
        if (res.ok) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = `${styleUrl}?t=${Date.now()}`;
          link.id = `plugin-style-${plugin.id}`;
          document.head.appendChild(link);
        }
      } catch (e) {
        // ignore
      }

      if (plugin.main) {
        // 캐시를 방지하기 위해 타임스탬프를 추가 (플러그인 재설치/업데이트 시 이전 코드 실행 방지)
        const entryUrl = `plugin://${plugin.id}/${plugin.main}?t=${Date.now()}`;
        const pluginModule = await import(/* @vite-ignore */ entryUrl);

        if (pluginModule && typeof pluginModule.activated === 'function') {
          const context = this.createContext(plugin);
          await pluginModule.activated(context);
          this.activePlugins.set(plugin.id, { module: pluginModule, context });
          console.log(`Plugin ${plugin.name} loaded successfully`);
        }
      } else {
        // 스크립트가 없는 manifest 전용 플러그인의 경우
        this.activePlugins.set(plugin.id, { module: null, context: null });
        console.log(`Plugin ${plugin.name} (manifest only) loaded successfully`);
      }

      window.dispatchEvent(
        new CustomEvent('plugin:loaded', {
          detail: { plugin },
        })
      );
    } catch (error) {
      console.error(`Failed to execute plugin ${plugin.name}`, error);
    }
  }

  public async unloadPlugin(pluginId: string) {
    try {
      const active = this.activePlugins.get(pluginId) as { module: any, context: PluginContext } | undefined;
      if (active) {
        if (active.module && typeof active.module.deactivated === 'function') {
          await active.module.deactivated(active.context);
        }
        this.activePlugins.delete(pluginId);
        
        // 플러그인 CSS 제거
        const link = document.getElementById(`plugin-style-${pluginId}`);
        if (link) {
          link.remove();
        }
        
        console.log(`Plugin ${pluginId} unloaded successfully`);
        
        window.dispatchEvent(
          new CustomEvent('plugin:unloaded', {
            detail: { pluginId },
          })
        );
      }
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}`, error);
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
        registerSettingsTab: (tabId: string, options: RegisterSettingsTabOptions) => {
          window.dispatchEvent(
            new CustomEvent('plugin:register-settings-tab', {
              detail: {
                pluginId: plugin.id,
                pluginName: plugin.name,
                tabId,
                ...options,
              },
            })
          );
        },
      },
    };
  }
}

export const pluginLoader = new PluginLoader();
