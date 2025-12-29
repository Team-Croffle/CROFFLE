import { registerWindowIpcHandlers } from './window.handler';
import { registerScheduleIpcHandlers } from './schedule.handler';
import { registerTagIpcHandlers } from './tag.handler';
import { registerPluginInfoIpcHandlers } from './pluginInfo.handler';

export function registerAllIpcHandlers() {
  // Window IPC Handlers
  registerWindowIpcHandlers();

  // Schedule IPC Handlers
  registerScheduleIpcHandlers();

  // Tag IPC Handlers
  registerTagIpcHandlers();

  // Plugin Manager IPC Handlers
  registerPluginInfoIpcHandlers();

  // Search IPC Handlers

  // Application Management IPC Handlers

  // Settings IPC Handlers

  // Schdule Import/Export IPC Handlers
}
