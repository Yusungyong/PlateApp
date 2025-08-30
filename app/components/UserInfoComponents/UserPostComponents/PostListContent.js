import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import usePostList from './userPostList';
import VideoActionModal from './VideoActionModal';
import { useDeleteItem } from './useDeleteItem';

const PostListContent = ({ onThumbnailPress }) => {
  const [selectedFilter, setSelectedFilter] = useState('CD_001');
  const { items: fetchedItems = [], isLoading = false } = usePostList(selectedFilter);
  const { deleteItem } = useDeleteItem();

  const [items, setItems] = useState([]);
  const [longPressedItem, setLongPressedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setItems(fetchedItems); // 서버 데이터 동기화
  }, [fetchedItems]);

  const handleLongPress = (item) => {
    setLongPressedItem(item);
    setModalVisible(true);
  };

  const handleDelete = async (storeId: number) => {
    try {
      await deleteItem(storeId);
      Alert.alert('삭제 완료', '게시물이 성공적으로 삭제되었습니다.');
      setItems((prev) => prev.filter((item) => item.storeId !== storeId));
      setModalVisible(false);
    } catch (err) {
      // 내부 alert 처리됨
    }
  };

  const adjustedItems = useMemo(() => {
    const remainder = items.length % 3;
    if (remainder === 0) return items;
    return [...items, ...Array(3 - remainder).fill({ isPlaceholder: true })];
  }, [items]);

  const renderItem = ({ item }) => {
    if (item.isPlaceholder) {
      return <View style={[styles.gridCardContainer, styles.placeholderCard]} />;
    }

    return (
      <TouchableOpacity
        style={styles.gridCardContainer}
        activeOpacity={0.85}
        onPress={() => item.imageUrl && onThumbnailPress(item)}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500} // 0.5초
      >
        <FastImage
          source={{
            uri: item.imageUrl ?? 'https://example.com/default-image.jpg',
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <FlatList
          data={Array.from({ length: 9 })}
          keyExtractor={(_, i) => `loading_${i}`}
          renderItem={() => <View style={[styles.gridCardContainer, styles.placeholderCard]} />}
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>게시물이 없습니다.</Text>
      ) : (
        <FlatList
          data={adjustedItems}
          keyExtractor={(item, index) =>
            item.storeId ? String(item.storeId) : `fallback_${index}`
          }
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />
      )}

      <VideoActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDelete={() =>
          longPressedItem?.storeId != null && handleDelete(longPressedItem.storeId)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  flatListContainer: { padding: 0, margin: 0 },
  gridCardContainer: {
    flex: 1,
    margin: 1,
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 3 / 4,
    backgroundColor: '#f9f9f9',
  },
  image: { width: '100%', height: '100%' },
  placeholderCard: { backgroundColor: '#e0e0e0' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
});

export default React.memo(PostListContent);
