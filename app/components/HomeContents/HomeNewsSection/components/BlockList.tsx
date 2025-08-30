import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform, // ✅ react-native에서 import
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import BlockItem from './BlockItem';
import type { Block } from '../types';

interface Props {
  blocks: Block[];
  onBlocksChange: (updated: Block[]) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDeleteBlock: (id: string) => void;
  footer?: React.ReactNode;
  onUpdateImages?: (id: string, uris: string[], ratios?: number[]) => void;
}

const BlockList: React.FC<Props> = ({
  blocks,
  onBlocksChange,
  onUpdateContent,
  onDeleteBlock,
  footer,
  onUpdateImages,
}) => {
  const listRef = useRef<any>(null);
  const scrollOffsetRef = useRef(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  return (
    <DraggableFlatList
      ref={listRef}
      data={blocks}
      keyExtractor={(item) => item.id}
      onDragEnd={({ data }) => onBlocksChange(data)}
      renderItem={({ item, drag, isActive }) => (
        <View>
          <BlockItem
            item={item}
            drag={drag}
            isActive={isActive}
            onUpdateContent={onUpdateContent}
            onDelete={onDeleteBlock}
            onUpdateImages={onUpdateImages}
            // 수동 포커스 스크롤은 충돌을 일으켜 제거
          />
        </View>
      )}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<View style={{ height: 24 }} />}
      ListFooterComponent={footer || <View style={{ height: 16 }} />}

      /* ✅ iOS 안정화 옵션 */
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      maintainVisibleContentPosition={
        Platform.OS === 'ios'
          ? { autoscrollToTopThreshold: 1, minIndexForVisible: 0 }
          : undefined
      }
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => Keyboard.dismiss()}
      onScroll={onScroll}
      scrollEventThrottle={16}

      /* 드래그/스크롤 튜닝 */
      activationDistance={16}
      initialNumToRender={8}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
  },
});

export default BlockList;
