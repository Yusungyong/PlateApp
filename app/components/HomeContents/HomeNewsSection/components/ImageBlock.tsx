import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 12; // aligned with BlockList
const imageGap = 8;

interface Props {
  uris: string[];
  aspectRatios?: number[];
  onChange?: (uris: string[], ratios?: number[]) => void; // per-image update callback
}

type ImgItem = { key: string; uri: string; ratio?: number };

const ImageBlock: React.FC<Props> = ({ uris, aspectRatios, onChange }) => {
  const [singleRatio, setSingleRatio] = useState<number>(aspectRatios?.[0] || 1);
  const items = useMemo<ImgItem[]>(
    () => uris.map((u, i) => ({ key: `${u}-${i}`, uri: u, ratio: aspectRatios?.[i] })),
    [uris, aspectRatios]
  );

  useEffect(() => {
    if (uris.length === 1 && !aspectRatios?.[0]) {
      Image.getSize(uris[0], (w, h) => setSingleRatio(w && h ? w / h : 1), () => setSingleRatio(1));
    }
  }, [uris, aspectRatios]);

  const fullWidth = useMemo(() => screenWidth - horizontalPadding * 2, []);

  const emitChange = (arr: ImgItem[]) => {
    const nextUris = arr.map(a => a.uri);
    const nextRatios = arr.map(a => (a.ratio == null ? 1 : a.ratio));
    onChange?.(nextUris, nextRatios);
  };

  const deleteAt = (index: number) => {
    const filtered = items.filter((_, i) => i !== index);
    emitChange(filtered);
  };

  if (uris.length === 0) return null;

  if (uris.length === 1) {
    return (
      <View style={styles.singleWrapper}>
        <FastImage
          source={{ uri: uris[0] }}
          style={{ width: fullWidth, height: fullWidth / (singleRatio || 1), borderRadius: 10 }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TouchableOpacity style={styles.deleteBadge} onPress={() => deleteAt(0)}>
          <Icon name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // 2개 이상이면: 드래그 가능한 2열 그리드
  return (
    <DraggableFlatList
      data={items}
      keyExtractor={(it) => it.key}
      renderItem={({ item, drag, isActive, index }: RenderItemParams<ImgItem>) => (
        <View style={[styles.gridImageWrapper, isActive && { opacity: 0.85 }]}>
          <TouchableOpacity activeOpacity={0.9} onLongPress={drag} delayLongPress={120}>
            <FastImage
              source={{ uri: item.uri }}
              style={styles.gridImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>

          {/* delete badge */}
          <TouchableOpacity style={styles.deleteBadge} onPress={() => deleteAt(index)}>
            <Icon name="close" size={16} color="#fff" />
          </TouchableOpacity>

          {/* drag hint */}
          <View style={styles.dragHint}>
            <Icon name="reorder-three-outline" size={18} color="#fff" />
          </View>
        </View>
      )}
      onDragEnd={({ data }) => emitChange(data)}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={{ gap: imageGap }}
      columnWrapperStyle={{ justifyContent: 'space-between', gap: imageGap }}
    />
  );
};

const styles = StyleSheet.create({
  singleWrapper: { alignSelf: 'center' },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHint: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  gridImageWrapper: { position: 'relative' },
  gridImage: {
    width: (screenWidth - horizontalPadding * 2 - imageGap * 1) / 2,
    height: 140,
    borderRadius: 10,
  },
});

export default ImageBlock;
