import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import FeedThumbnailItem from './FeedThumbnailItem';

const itemWidth = Dimensions.get('window').width / 3;

const INITIAL_RENDER = 21;
const BATCH_RENDER = 9;

const FeedGrid = ({ feeds, loading, error, onPress }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_RENDER);

  useEffect(() => {
    setVisibleCount(INITIAL_RENDER);
  }, [feeds]);

  useEffect(() => {
    if (feeds) {
      const feedIds = feeds.map(f => f.feedId);
      const uniqueFeedIds = new Set(feedIds);
      if (feedIds.length !== uniqueFeedIds.size) {
        console.warn('⚠️ 중복 feedId 있음! 실제 feedIds:', feedIds);
      }
      console.log('피드 개수:', feeds.length);
    }
  }, [feeds]);

  const handleLoadMore = () => {
    if (feeds && visibleCount < feeds.length) {
      setVisibleCount(prev => Math.min(prev + BATCH_RENDER, feeds.length));
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 40 }} />;
  if (error) return <Text style={styles.centerText}>에러가 발생했습니다.</Text>;
  if (!feeds || feeds.length === 0) return <Text style={styles.centerText}>피드가 없습니다.</Text>;

  return (
    <FlatList
      data={feeds.slice(0, visibleCount)}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <FeedThumbnailItem
            feed={item}
            onPressImage={() => onPress(item)}
          />
        </View>
      )}
      numColumns={3}
      keyExtractor={(item, idx) => item.feedId ? item.feedId.toString() : idx.toString()}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
      initialNumToRender={21}
      maxToRenderPerBatch={9}
      windowSize={5}
      removeClippedSubviews={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingBottom: 24,
    paddingHorizontal: 2,
    minHeight: 80,
  },
  item: {
    flexBasis: '33.333%',
    aspectRatio: 1,
    margin: 1,      // 필요시 최소화
    alignItems: 'stretch', // stretch가 더 깔끔하게 맞춰줌
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginTop: 48,
    color: '#888',
    fontSize: 16,
  },
});

export default FeedGrid;
