// screens/FeedListContent.tsx
import React from 'react';
import { View } from 'react-native';
import PlateList from './PlateList';
import PlateCardSkeleton from './PlateCardSkeleton';
import { useFeedList } from './useFeedList';

const FeedListContent: React.FC = () => {
  const {
    feeds,
    loading,
    refreshing,
    expandedFeedIds,
    toggleExpand,
    onRefresh,
  } = useFeedList();

  return (
    <>
      {loading && !refreshing ? (
        <View style={{ padding: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PlateCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <PlateList
          feeds={feeds}
          expandedFeedIds={expandedFeedIds}
          onToggleExpand={toggleExpand}
          refreshing={refreshing}
          onRefresh={onRefresh}
          loading={loading}
        />
      )}
    </>
  );
};

export default FeedListContent;
