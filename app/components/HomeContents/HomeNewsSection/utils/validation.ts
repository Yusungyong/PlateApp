import type { Block } from '../types';

export const getTitleBlock = (blocks: Block[]) =>
  blocks.find((b) => b.type === 'title' && typeof (b as any).content === 'string' && (b as any).content.trim());

export const getTextBlocks = (blocks: Block[]) =>
  blocks.filter((b) => b.type === 'text' && typeof (b as any).content === 'string' && (b as any).content.trim());

export const getImageBlocks = (blocks: Block[]) =>
  blocks.filter((b) => b.type === 'image' && Array.isArray((b as any).uris) && (b as any).uris.length > 0);

export const isValidToSave = (blocks: Block[]) => {
  const hasTitle = !!getTitleBlock(blocks);
  const hasText = getTextBlocks(blocks).length > 0;
  const hasImage = getImageBlocks(blocks).length > 0;
  return hasTitle && hasText && hasImage;
};