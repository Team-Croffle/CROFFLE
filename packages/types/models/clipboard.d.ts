export declare enum ClipboardDataType {
  TEXT = 'text',
  IMAGE = 'image',
  EMPTY = 'empty',
  ERROR = 'error',
}

export type ClipboardResult = {
  type: ClipboardDataType;
  value: string | Buffer | null;
};

export type ClipboardTextData = {
  type: ClipboardDataType.TEXT;
  value: string;
};

export type ClipboardImageData = {
  type: ClipboardDataType.IMAGE;
  value: Buffer;
};
