import type { ConfigurationSectionContribution } from '../models/extension';

export type RegisterConfigurationTabOptions = {
  label: string;
  icon?: unknown;
  order?: number;
  render?: (container: HTMLElement) => void;
  sections?: ConfigurationSectionContribution[];
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
   * 앱 설정 모달에 extension configuration 탭을 추가합니다.
   * @param tabId 고유 탭 ID (`${extensionId}:${tabId}` 형태로 저장됨)
   */
  registerConfigurationTab(tabId: string, options: RegisterConfigurationTabOptions): void;
}
