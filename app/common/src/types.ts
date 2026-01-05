export interface Schedule {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  isAllDay: boolean;
  recurrenceRule?: string;
  colorLabel: string;
  tags: Tag[];
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface SearchQuery {
  text?: string;
  dateRange?: {
    start: string; // ISO 8601 format
    end: string; // ISO 8601 format
  };
  tags?: Tag[];
}

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
}
