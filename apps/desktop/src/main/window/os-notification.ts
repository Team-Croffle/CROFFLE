import path from 'node:path';

import { Notification, app } from 'electron';

import { logger } from '../logger';

export function showNotification(title?: string, body?: string): void {
  try {
    if (!Notification.isSupported()) {
      logger.warn('OS', 'Notification not supported');
      return;
    }

    const Title = title?.trim();
    const Body = body?.trim();

    if (!Title && !Body) {
      logger.warn('OS', 'Notification content is empty');
      return;
    }

    new Notification({
      icon: path.join(app.getAppPath(), '../../icons/Logo2OnlyNoBorderIcon.png'),
      title: Title || 'Notification',
      body: Body || '',
    }).show();
  } catch (error) {
    logger.error('OS', 'Notification error:', error);
    throw error;
  }
}
