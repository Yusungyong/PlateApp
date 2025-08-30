// hooks/useFeedList.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../services/api/apiService';
import { FeedItem } from './types';

export const useFeedList = () => {
  const { apiCall } = useApiService();

  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [expandedFeedIds, setExpandedFeedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const toggleExpand = (feedId: number) => {
    setExpandedFeedIds(prev =>
      prev.includes(feedId) ? prev.filter(id => id !== feedId) : [...prev, feedId]
    );
  };

  const fetchFeeds = useCallback(async () => {
    if (!refreshing) setLoading(true);
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) return;

      const response = await apiCall<FeedItem[]>({
        method: 'POST',
        url: '/user-feed-list',
        data: { username },
      });

      const enriched = response.map(feed => ({
        ...feed,
        tasteTags: feed.tags?.split(',').map(tag => tag.trim()) ?? [],
        friendNames: feed.friendNames?.split(',').map(n => n.trim()) ?? [],
      }));

      setFeeds(enriched);
    } catch (err) {
      console.error('피드 목록 로딩 실패:', err);
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  }, [apiCall, refreshing]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeeds();
  };

  return {
    feeds,
    loading,
    refreshing,
    expandedFeedIds,
    toggleExpand,
    onRefresh,
    setFeeds, // 삭제 후 갱신용
  };
};
