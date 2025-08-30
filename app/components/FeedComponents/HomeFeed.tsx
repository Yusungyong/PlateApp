import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFeedData } from './Hooks/feedItemHooks/useFeedData';
import FeedItem from './FeedItem/FeedItem';
import VideoItem from './VideoItem/videoItem/VideoItem';
import { HomeFeedstyles } from '../../styles/HomeFeedStyle';
import { usePlayHooks } from '../videoComponents/videoComponetHooks/playHooks';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const HomeFeed: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const feedIdParam = route.params?.feedId;
  const validFeedId = feedIdParam && feedIdParam !== 0 ? feedIdParam : undefined;

  const placeIdParam = route.params?.placeId;
  const validPlaceId = placeIdParam && placeIdParam !== 0 ? placeIdParam : undefined;

  const storeId = 1;
  const { videoData: hookVideoData, fetchVideoData: hookFetchVideoData } = usePlayHooks(storeId);
  const videoData = validPlaceId ? [] : hookVideoData;
  const fetchVideoData = validPlaceId ? () => {} : hookFetchVideoData;

  const { feedData, loading, error, refetch } = useFeedData(validFeedId, validPlaceId);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleItemIds, setVisibleItemIds] = useState([]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const ids = viewableItems.map(item => item.item.id);
    setVisibleItemIds(ids);
  }).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  useEffect(() => {
    if (route.params?.refresh) {
      refetch();
      navigation.setParams({ refresh: false });
    }
  }, [route.params, refetch, navigation]);

  useEffect(() => {
    if (!validPlaceId) {
      fetchVideoData();
    }
  }, [validPlaceId]);

  const combinedData = useMemo(() => {
    const feedItems = feedData.map(item => ({ ...item, type: 'feed' }));
    const videoItems = videoData.map(item => ({ ...item, type: 'video' }));
    const allItems = feedItems.concat(videoItems);
    return allItems.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [feedData, videoData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetch(),
      validPlaceId ? Promise.resolve() : fetchVideoData()
    ]);
    setVisibleCount(3);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && visibleCount < combinedData.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  };

  if (loading && feedData.length === 0 && !refreshing) {
    return (
      <View style={HomeFeedstyles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={HomeFeedstyles.errorContainer}>
        <Text style={HomeFeedstyles.errorText}>{error}</Text>
        <Text onPress={refetch} style={HomeFeedstyles.retryText}>
          다시 시도
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={HomeFeedstyles.container}>
      <KeyboardAwareFlatList
        data={combinedData.slice(0, visibleCount)}
        keyExtractor={(item) => item.id.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => {
          if (item.type === 'feed') {
            return <FeedItem item={item} />;
          } else if (item.type === 'video') {
            const isActive = visibleItemIds.includes(item.id);
            return <VideoItem item={item} isActive={isActive} />;
          }
          return null;
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 60}
        enableOnAndroid={true}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
};

export default HomeFeed;
