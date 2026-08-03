import { Notification } from 'electron';

import logo from '../../../resources/logo-no-border.png?asset';
import { logger } from '../logger';

export function showNotification(title?: string, body?: string, onClick?: () => void): void {
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

    const notification = new Notification({
      icon: logo,
      title: Title || 'Notification',
      body: Body || '',
    });

    if (onClick) {
      notification.on('click', onClick);
    }

    notification.show();
  } catch (error) {
    logger.error('OS', 'Notification error:', error);
    throw error;
  }
}
