import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Platform,
} from 'react-native';
import PlateCard, { FeedItem } from './PlateCard';

interface Props {
  feeds: FeedItem[];
  expandedFeedIds: number[];
  onToggleExpand: (feedId: number) => void;
  refreshing: boolean;
  onRefresh: () => void;
  loading: boolean;
}

const PlateList: React.FC<Props> = ({
  feeds: initialFeeds,
  expandedFeedIds,
  onToggleExpand,
  refreshing,
  onRefresh,
  loading,
}) => {
  const [feeds, setFeeds] = useState<FeedItem[]>(initialFeeds);

  useEffect(() => {
    setFeeds(initialFeeds); // 외부에서 props가 바뀔 경우 반영
  }, [initialFeeds]);

  const handleEdit = (feedId: number) => {
    console.log('✏️ 수정 아이콘 클릭됨:', feedId);
    // 네비게이션 또는 수정 로직 연결 가능
  };

  const handleDeleteSuccess = (deletedFeedId: number) => {
    setFeeds(prev => prev.filter(item => item.feedId !== deletedFeedId));
  };

  const renderItem = ({ item }: { item: FeedItem }) => {
    const isExpanded = expandedFeedIds.includes(item.feedId);
    return (
      <PlateCard
        feed={item}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(item.feedId)}
        onEdit={handleEdit}
        onDeleteSuccess={handleDeleteSuccess}
      />
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <FlatList
      data={feeds}
      keyExtractor={(item) => item.feedId.toString()}
      renderItem={renderItem}
      contentContainerStyle={
        feeds.length === 0 ? styles.emptyContainer : styles.listContainer
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>등록된 게시글이 없어요 🥲</Text>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={Platform.OS === 'android'}
    />
  );
};

export default PlateList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
});
