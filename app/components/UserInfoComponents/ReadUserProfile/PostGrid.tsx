import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import PostThumbnailItem, { PostThumbnailItemProps } from './PostThumbnailItem';

const windowWidth = Dimensions.get('window').width;
const numColumns = 3;
const thumbnailMargin = 1;
const thumbnailSize = (windowWidth - (numColumns + 1) * thumbnailMargin) / numColumns;

export interface PostGridProps {
  posts?: any[];
  loading?: boolean;
  error?: Error | null;
  onPress: (post: any) => void;
}

const PostGrid: React.FC<PostGridProps> = ({ posts = [], loading, error, onPress }) => {
  const keyExtractor = (item: any, idx: number) => item.id?.toString() || item.thumbnail || String(idx);

  if (loading) return <ActivityIndicator size="large" color="#aaa" style={styles.loading} />;
  if (error) return <Text style={styles.errorText}>에러: {error.message}</Text>;

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          activeOpacity={0.8}
          onPress={() => onPress(item)}
        >
          <PostThumbnailItem post={item} />
        </TouchableOpacity>
      )}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.emptyText}>아직 등록한 포스트가 없습니다.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingBottom: 24,
    paddingHorizontal: 4,
    minHeight: 80,
  },
  thumbnailContainer: {
    width: thumbnailSize,
    height: thumbnailSize,
    margin: thumbnailMargin,
    borderRadius: 10,
    overflow: 'hidden',
  },
  loading: { marginVertical: 20 },
  errorText: { fontSize: 16, color: 'red', marginVertical: 20, textAlign: 'center' },
  emptyText: { fontSize: 15, color: '#bbb', marginVertical: 60, textAlign: 'center' },
});

export default PostGrid;
