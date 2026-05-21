import { app } from 'electron';
import type { AppSettings } from '@croffledev/croffle-types';
import { AppSettingStartupBehavior } from '../../../../shared/enums';
import { eventService } from '../../../core/event-bus/EventService';
import { windowService } from '../../../core/window/WindowService';

export const LOGIN_HIDDEN_ARG = '--croffle-start-hidden';

class SettingsApplyService {
  /** 로그인 항목(시작 프로그램) 등록 상태 반영 */
  public applyLoginItem(settings: AppSettings): void {
    const { startOnSystemBoot, startMinimized } = settings.general;

    app.setLoginItemSettings({
      openAtLogin: startOnSystemBoot,
      openAsHidden: startMinimized,
      args: startMinimized ? [LOGIN_HIDDEN_ARG] : [],
    });
  }

  public applyPersisted(settings: AppSettings): void {
    this.applyLoginItem(settings);
  }

  /** 앱 최초 표시 시(로그인 시작 포함) 창 표시·라우팅 결정 */
  public applyStartupPresentation(settings: AppSettings): void {
    this.applyLoginItem(settings);

    const loginSettings = app.getLoginItemSettings();
    const wasOpenedAtLogin = loginSettings.wasOpenedAtLogin ?? false;
    const wasOpenedAsHidden =
      loginSettings.wasOpenedAsHidden ?? process.argv.includes(LOGIN_HIDDEN_ARG);

    if (!wasOpenedAtLogin) {
      return;
    }

    const { startupBehavior, startMinimized } = settings.general;
    const shouldHide =
      startupBehavior === AppSettingStartupBehavior.DO_NOTHING ||
      startMinimized ||
      wasOpenedAsHidden;

    if (shouldHide) {
      windowService.hideWindow();
      return;
    }

    if (startupBehavior === AppSettingStartupBehavior.OPEN_NEW_WINDOW) {
      eventService.emit('settings:startup-navigate', '/calendar');
    }
  }

  public shouldCheckForUpdates(settings: AppSettings): boolean {
    return settings.general.autoUpdate;
  }
}

export const settingsApplyService = new SettingsApplyService();
