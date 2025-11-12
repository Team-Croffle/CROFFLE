import { registerWindowIpcHandlers } from './window.handler';
import { registerScheduleIpcHandlers } from './schedule.handler';

export function registerAllIpcHandlers() {
  // Window IPC Handlers
  registerWindowIpcHandlers();

  // Schedule IPC Handlers
  registerScheduleIpcHandlers();

  // Tag IPC Handlers

  // Plugin Manager IPC Handlers

  // Search IPC Handlers

  // Application Management IPC Handlers

  // Settings IPC Handlers

  // Schdule Import/Export IPC Handlers
}
