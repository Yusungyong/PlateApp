export type BlockType = 'title' | 'text' | 'image';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'title' | 'text';
  content: string;
}

export interface ImageBlockData extends BaseBlock {
  type: 'image';
  uris: string[];
  aspectRatios?: number[]; // each uri's width/height
}

export type Block = TextBlock | ImageBlockData;

export type BlocksState = Block[];