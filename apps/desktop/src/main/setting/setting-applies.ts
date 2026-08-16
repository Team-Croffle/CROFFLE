import type { AppSettings } from '@croffledev/croffle-types';
import { app } from 'electron';

import { windowService } from '../window/window-service';

export const LOGIN_HIDDEN_ARG = '--croffle-start-hidden';
export const STARTUP_ARG = '--startup';

/** 로그인 항목(시작 프로그램) 등록 상태 반영 */
export function applyLoginItem(settings: AppSettings): void {
  if (!app.isPackaged) {
    return;
  }

  const { startOnSystemBoot, startMinimized } = settings.general;
  const args: string[] = [];

  if (startOnSystemBoot) {
    args.push(STARTUP_ARG);
    if (startMinimized) {
      args.push(LOGIN_HIDDEN_ARG);
    }
  }

  app.setLoginItemSettings({
    openAtLogin: startOnSystemBoot,
    openAsHidden: startMinimized,
    path: process.execPath,
    args: args,
  });
}

export function applyPersisted(settings: AppSettings): void {
  applyLoginItem(settings);
}

/** 앱 최초 표시 시(로그인 시작 포함) 창 표시 결정 */
export function applyStartupPresentation(settings: AppSettings): void {
  applyLoginItem(settings);

  const loginSettings = app.getLoginItemSettings();
  const wasOpenedAtLogin = loginSettings.wasOpenedAtLogin || process.argv.includes(STARTUP_ARG);
  const wasOpenedAsHidden = process.argv.includes(LOGIN_HIDDEN_ARG);

  if (!wasOpenedAtLogin) {
    return;
  }

  const { startMinimized } = settings.general;
  const shouldHide = startMinimized || wasOpenedAsHidden;

  if (shouldHide) {
    windowService.hideWindow();
  }
}

export function shouldCheckForUpdates(settings: AppSettings): boolean {
  return settings.general.autoUpdate;
}
