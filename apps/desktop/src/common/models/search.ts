import type { Tag } from './tag';

export type SearchQuery = {
  text?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: Tag[];
};
