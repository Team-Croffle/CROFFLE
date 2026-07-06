import log from 'electron-log/main';
import { app } from 'electron';

export class LoggerService {
  constructor() {
    log.initialize();

    // 개발 환경이면 log level debug, Production이면 error
    const isProd = app.isPackaged;

    log.transports.console.level = isProd ? 'error' : 'debug';
    log.transports.file.level = isProd ? 'info' : 'debug';
    log.transports.file.format = '[{d}/{m}/{y} {h}:{i}:{s}] {level} | {text}';
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
}

export const logger = new LoggerService();
