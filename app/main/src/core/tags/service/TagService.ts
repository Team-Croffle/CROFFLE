import { databaseManager } from '../../../services/DatabaseManager';
import { Tag } from '../model/Tag';

export const tagService = {
  getAllTags: async () => {
    const tagRepo = databaseManager.getRepository(Tag);
    const tags = await tagRepo.find();
    return tags;
  },

  addTag: async (name: string, color: string) => {
    const tagRepo = databaseManager.getRepository(Tag);
    const newTag = tagRepo.create({ name, color });
    await tagRepo.save(newTag);
    return newTag;
  },

  modTag: async (id: string, name: string, color: string) => {
    const tagRepo = databaseManager.getRepository(Tag);
    const tag = await tagRepo.findOneBy({ id });
    if (!tag) throw new Error('Tag not found');

    tag.name = name;
    tag.color = color;
    await tagRepo.save(tag);
    return tag;
  },

  delTag: async (id: string) => {
    const tagRepo = databaseManager.getRepository(Tag);
    const tag = await tagRepo.findOneBy({ id });
    if (!tag) throw new Error('Tag not found');

    await tagRepo.remove(tag);
    return true;
  },
};
