import { Tag } from '@croffledev/croffle-common';
import { ipcRenderer } from 'electron';

export const tagApi = {
  getAllTags: async (): Promise<Tag[]> => {
    return ipcRenderer.invoke('tag:getAll');
  },

  getTagByName: async (name: string): Promise<Tag | null> => {
    return ipcRenderer.invoke('tag:getByName', name);
  },

  createTag: async (name: string, color: string): Promise<Tag> => {
    return ipcRenderer.invoke('tag:add', name, color);
  },

  modifyTag: async (id: string, name: string, color: string): Promise<Tag> => {
    return ipcRenderer.invoke('tag:mod', id, name, color);
  },

  deleteTag: async (id: string): Promise<boolean> => {
    return ipcRenderer.invoke('tag:del', id);
  },
};
