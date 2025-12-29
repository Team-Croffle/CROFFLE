import { ipcMain } from 'electron';
import { tagService } from '../core/tags/service/TagService';
import { Tag } from '@croffledev/croffle-common';

export const registerTagIpcHandlers = (): void => {
  ipcMain.handle('tag:getAll', async (): Promise<Tag[]> => {
    const tags = await tagService.getAllTags();
    return tags;
  });

  ipcMain.handle('tag:getByName', async (_, name: string): Promise<Tag | null> => {
    const tag = await tagService.getByName(name);
    return tag;
  });

  ipcMain.handle('tag:add', async (_, name: string, color: string): Promise<Tag> => {
    const newTag = await tagService.addTag(name, color);
    return newTag;
  });

  ipcMain.handle('tag:mod', async (_, id: string, name: string, color: string): Promise<Tag> => {
    const updatedTag = await tagService.modTag(id, name, color);
    return updatedTag;
  });

  ipcMain.handle('tag:del', async (_, id: string): Promise<boolean> => {
    const result = await tagService.delTag(id);
    return result;
  });
};

export interface TagApi {
  getAllTags(): Promise<Tag[]>;
  getTagByName(name: string): Promise<Tag | null>;
  createTag(name: string, color: string): Promise<Tag>;
  modifyTag(id: string, name: string, color: string): Promise<Tag>;
  deleteTag(id: string): Promise<boolean>;
}
