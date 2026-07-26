import { registerWindowIpcHandlers } from './window.handler';
import { registerScheduleIpcHandlers } from './schedule.handler';
import { registerTagIpcHandlers } from './tag.handler';
import { registerPluginInfoIpcHandlers } from './plugin-info.handler';
import { registerSearchIpcHandlers } from './search.handler';
import { registerSettingsIpcHandlers } from './settings.handler';
import { registerOsIpcHandlers } from './os.handler';
import { registerPluginStorageIpcHandlers } from './plugin-storage.handler';
import { registerHttpIpcHandlers } from './http.handler';
import { registerEventIpcHandlers } from './event.handler';
import { registerPluginSessionIpcHandlers } from './plugin-session.handler';
import { logger } from '../logger';

export function registerAllIpcHandlers() {
  logger.debug('IPC', 'Registering Window IPC Handlers');
  // Window IPC Handlers
  registerWindowIpcHandlers();

  logger.debug('IPC', 'Registering Schedule IPC Handlers');
  // Schedule IPC Handlers
  registerScheduleIpcHandlers();

  logger.debug('IPC', 'Registering Tag IPC Handlers');
  // Tag IPC Handlers
  registerTagIpcHandlers();

  logger.debug('IPC', 'Registering Plugin Manager IPC Handlers');
  // Plugin Manager IPC Handlers
  registerPluginInfoIpcHandlers();

  logger.debug('IPC', 'Registering Search IPC Handlers');
  // Search IPC Handlers
  registerSearchIpcHandlers();

  // Application Management IPC Handlers

  logger.debug('IPC', 'Registering Settings IPC Handlers');
  // Settings IPC Handlers
  registerSettingsIpcHandlers();

  // Schdule Import/Export IPC Handlers

  logger.debug('IPC', 'Registering OS Service IPC Handlers');
  // OS Service IPC Handlers
  registerOsIpcHandlers();

  logger.debug('IPC', 'Registering Plugin Storage IPC Handlers');
  // Plugin Storage IPC Handlers
  registerPluginStorageIpcHandlers();

  logger.debug('IPC', 'Registering HTTP IPC Handlers');
  // HTTP IPC Handlers
  registerHttpIpcHandlers();

  logger.debug('IPC', 'Registering Event IPC Handlers');
  // Event IPC Handlers
  registerEventIpcHandlers();

  logger.debug('IPC', 'Registering Plugin Session IPC Handlers');
  // Plugin Session IPC Handlers
  registerPluginSessionIpcHandlers();

  logger.info('IPC', 'All IPC handlers registered successfully');
}
