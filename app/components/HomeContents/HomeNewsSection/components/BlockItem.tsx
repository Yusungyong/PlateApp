import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageBlock from './ImageBlock';
import BlockTextInput from './BlockTextInput';
import type { Block } from '../types';

interface Props {
  item: Block;
  drag: () => void;
  isActive: boolean;
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onUpdateImages?: (id: string, nextUris: string[], nextRatios?: number[]) => void;
  onFocusInput?: () => void; // ✅ 추가: 인풋 포커스 시 호출
}

const BlockItem: React.FC<Props> = ({
  item,
  drag,
  isActive,
  onUpdateContent,
  onDelete,
  onUpdateImages,
  onFocusInput,
}) => {
  const isTitle = item.type === 'title';
  const isImage = item.type === 'image';

  return (
    <View style={[styles.card, isActive && { opacity: 0.8 }]}>
      <View style={styles.row}>
        {/* parent drag handle */}
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={180}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="reorder-three-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          {isImage ? (
            <ImageBlock
              uris={(item as any).uris}
              aspectRatios={(item as any).aspectRatios}
              onChange={(uris, ratios) => onUpdateImages?.(item.id, uris, ratios)}
            />
          ) : (
            <BlockTextInput
              isTitle={isTitle}
              value={(item as any).content || ''}
              placeholder={isTitle ? '제목 입력' : '내용 입력'}
              onChangeText={(t) => onUpdateContent(item.id, t)}
              onFocus={onFocusInput}     // ✅ 포커스 전달
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default BlockItem;
