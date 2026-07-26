import EventEmitter from 'node:events';

import { BrowserWindow } from 'electron';

import { logger } from '../logger';

class EventService extends EventEmitter {
  /**
   * Emit an event to main listeners and all active renderer windows.
   */
  public emit(eventName: string, ...args: unknown[]): boolean {
    const result = super.emit(eventName, ...args);

    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        try {
          win.webContents.send('croffle:app:event', eventName, ...args);
        } catch (err) {
          logger.info(
            'EventService',
            `Failed to send event ${eventName} to window ${win.id}: ${err}`,
          );
        }
      }
    });

    return result;
  }

  public on(eventName: string, listener: (...args: unknown[]) => void): this {
    super.on(eventName, listener);
    return this;
  }
}

export const eventService = new EventService();
