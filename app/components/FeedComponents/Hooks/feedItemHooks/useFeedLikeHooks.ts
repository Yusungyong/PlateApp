import { useApiService } from '../../../../services/api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFeedLikeHooks = () => {
  const { apiCall, invalidateCache } = useApiService();

  const axiosFeedLikeCall = async (feedId: string, likeYn: string, likeCount: number) => {
    const loginUserName = await AsyncStorage.getItem('username');
    
    try {

      // 좋아요 상태 토글
      const updatedLikeYn = likeYn === 'Y' ? 'N' : 'Y';

      // 캐시 무효화
      invalidateCache('feed-like');

      // API 호출
      const data = await apiCall({
        url: `feed-like`,
        method: 'POST',
        data: {
          feedId: feedId,
          username: loginUserName,
          useYn: updatedLikeYn,
        },
      });

      return { updatedLikeCount: data, updatedLikeYn };
    } catch (error) {
      console.error("❌ Error during feed like API call: ", error);
      return { updatedLikeCount: likeCount, updatedLikeYn: likeYn };
    }
  };

  return { axiosFeedLikeCall };
};
