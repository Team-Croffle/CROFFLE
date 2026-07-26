import type { SettingsSectionContribution } from '../models/plugin';

export type RegisterSettingsTabOptions = {
  label: string;
  icon?: unknown;
  order?: number;
  render?: (container: HTMLElement) => void;
  sections?: SettingsSectionContribution[];
};

export interface UiApi {
  registerView(viewId: string, renderFn: (container: HTMLElement) => void): void;
  registerContextMenu(
    target: string,
    command: string,
    label: string,
    callback: (target: string) => void,
  ): void;
  /**
   * 설정 모달에 탭을 추가합니다.
   * @param tabId 고유 탭 ID (플러그인 ID와 조합해 `${pluginId}:${tabId}` 형태로 저장됨)
   */
  registerSettingsTab(tabId: string, options: RegisterSettingsTabOptions): void;
}
