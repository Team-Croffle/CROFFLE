import { AppEventType } from '@croffledev/common';
import type { Tag } from '@croffledev/croffle-types';
import { ipcMain } from 'electron';

import { getAllTags, getTagByName, createTag, modifyTag, removeTag } from '../calendar/tag';
import { eventService } from '../event-bus/event-service';
import { tagMapper } from '../mapper/tag-mapper';

export const registerTagIpcHandlers = (): void => {
  ipcMain.handle('tag:getAll', async (): Promise<Tag[]> => {
    const entity = await getAllTags();

    // Add app event emit
    eventService.emit(AppEventType.TAG_GET, entity);

    return entity.map(tagMapper.toInterface);
  });

  ipcMain.handle('tag:getByName', async (_, name: string): Promise<Tag | null> => {
    const tag = await getTagByName(name);

    // Add app event emit
    eventService.emit(AppEventType.TAG_GET_BY_NAME, tag);
    return tag ? tagMapper.toInterface(tag) : null;
  });

  ipcMain.handle('tag:create', async (_, name: string, color: string): Promise<Tag> => {
    const newTag = await createTag(name, color);

    // Add app event emit
    eventService.emit(AppEventType.TAG_CREATE, newTag);

    return tagMapper.toInterface(newTag);
  });

  ipcMain.handle('tag:modify', async (_, id: string, name: string, color: string): Promise<Tag> => {
    const updatedTag = await modifyTag(id, name, color);

    // Add app event emit
    eventService.emit(AppEventType.TAG_UPDATE, updatedTag);

    return tagMapper.toInterface(updatedTag);
  });

  ipcMain.handle('tag:remove', async (_, id: string): Promise<boolean> => {
    const result = await removeTag(id);

    // Add app event emit
    eventService.emit(AppEventType.TAG_DELETE, id);

    return result;
  });
};
