import { app, BrowserWindow, Menu, Tray, nativeImage, shell } from 'electron';
import path from 'path';

class WindowService {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  public isQuitting: boolean = false; // Service가 상태 관리

  public init(window: BrowserWindow): void {
    this.mainWindow = window;
    this.createTray();

    // close 이벤트 가로채기
    this.mainWindow.on('close', (event) => {
      if (!this.isQuitting) {
        event.preventDefault();
        this.mainWindow?.hide();
        return false;
      }
      return true;
    });

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    // 앱 종료 직전 트레이 청소
    app.on('before-quit', () => {
      this.isQuitting = true;
      this.tray?.destroy();
    });
  }

  private createTray(): void {
    try {
      const iconPath = app.isPackaged
        ? path.join(process.resourcesPath, 'icons/Logo2Only.png')
        : path.join(__dirname, '../../icons/Logo2Only.png');

      const icon = nativeImage.createFromPath(iconPath);
      if (icon.isEmpty()) {
        console.error('[WindowService] Failed to load tray icon. Check path.');
      }
      this.tray = new Tray(icon);
      this.tray.setToolTip('CROFFLE');

      const contextMenu = Menu.buildFromTemplate([
        { label: '열기', click: () => this.mainWindow?.show() },
        { type: 'separator' },
        { label: '종료', click: () => this.exitApp() },
      ]);

      this.tray.setContextMenu(contextMenu);
      this.tray.on('double-click', () => this.mainWindow?.show());
    } catch (err) {
      console.error('[WindowService] Tray error:', err);
    }
  }

  public exitApp(): void {
    this.isQuitting = true; // 종료 플래그 true로 변경
    app.quit();
  }

  public async checkForUpdates(): Promise<void> {
    console.info('[WindowService] Checking for updates...');
    // + 업데이트 로직
  }
}

export const windowService = new WindowService();
