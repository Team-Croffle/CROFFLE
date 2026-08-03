import path from 'node:path';

import { app } from 'electron';
import log from 'electron-log/main';
import { autoUpdater } from 'electron-updater';

export class LoggerService {
  constructor() {
    log.initialize();

    // 개발 환경이면 log level debug, Production이면 info
    const isProd = app.isPackaged;

    log.transports.console.level = isProd ? 'info' : 'debug';
    log.transports.file.level = isProd ? 'info' : 'debug';
    log.transports.file.format = '[{d}/{m}/{y} {h}:{i}:{s}] {level} | {text}';

    if (!isProd) {
      // electron-vite dev: cwd = apps/desktop → apps/desktop/dev/logs/main.log
      log.transports.file.resolvePathFn = () => path.join(process.cwd(), 'dev', 'logs', 'main.log');
    }

    // Auto Updater의 로깅을 이 loggerService로 설정합니다.
    autoUpdater.logger = log;
  }

  public info(context: string, message: string, ...meta: unknown[]) {
    log.info(`${context}: ${message}`, ...meta);
  }

  public warn(context: string, message: string, ...meta: unknown[]) {
    log.warn(`${context}: ${message}`, ...meta);
  }

  public error(context: string, message: string, ...meta: unknown[]) {
    log.error(`${context}: ${message}`, ...meta);
  }

  public debug(context: string, message: string, ...meta: unknown[]) {
    log.debug(`${context}: ${message}`, ...meta);
  }
}

export const logger = new LoggerService();
