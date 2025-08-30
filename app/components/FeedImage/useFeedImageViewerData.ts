// hooks/useFeedImageViewer.ts
import { useApiService } from "../../services/api/apiService";
import { useCallback } from 'react';

interface FeedImageViewerVO {
  feedId: number;
  username: string;
}

export const useFeedImageViewer = () => {
  const { apiCall } = useApiService();

  const fetchFeedImageViewer = useCallback(
    async (feedId: number, username: string) => {
      const data = await apiCall<FeedImageViewerVO>({
        url: 'api/notifications/get-feed-image-viewer',
        method: 'POST',
        data: { feedId, username },
      });
      return data;
    },
    [apiCall]
  );

  return { fetchFeedImageViewer };
};
