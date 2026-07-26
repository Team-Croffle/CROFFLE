import type { ConfigItemSchema, ConfigurationSectionContribution } from '@croffledev/croffle-types';

export const buildDefaultsFromSections = (
  sections: ConfigurationSectionContribution[],
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const section of sections) {
    for (const [key, schema] of Object.entries(section.items)) {
      defaults[key] = schema.defaultValue;
    }
  }
  return defaults;
};

export const mergeWithSchemaDefaults = (
  sections: ConfigurationSectionContribution[],
  stored: Record<string, unknown>,
): Record<string, unknown> => {
  const defaults = buildDefaultsFromSections(sections);
  return { ...defaults, ...stored };
};

export const collectSchemaItems = (
  sections: ConfigurationSectionContribution[],
): Record<string, ConfigItemSchema> => {
  const items: Record<string, ConfigItemSchema> = {};
  for (const section of sections) {
    Object.assign(items, section.items);
  }
  return items;
};
