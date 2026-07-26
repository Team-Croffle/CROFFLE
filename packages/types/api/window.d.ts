export interface WindowApi {
  minimize(): Promise<void>;
  maximize(): Promise<void>;
  close(): Promise<void>;
  exitApp(): Promise<void>;
  checkForUpdates(): Promise<void>;
  setCloseToTrayMode(enabled: boolean): Promise<void>;
}
