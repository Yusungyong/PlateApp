import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';


export const useLikeHooks = () => {
    
    const { apiCall, invalidateCache } = useApiService();

    const axiosLikeCall = async (storeId, likeYn, likeCount) => {
        const loginUserName = await AsyncStorage.getItem('username');
        try {
        likeYn = likeYn === 'Y' ? 'N' : 'Y'
        // 캐시 무효화
        invalidateCache('video-like');
    
        // API 호출
        const data = await apiCall({
            url: `video-like`,
            method: 'POST',
            data: {
            storeId: storeId,
            username: loginUserName,
            useYn: likeYn,
            },
        });
        
        const updatedLikeConut = data;
        const updatedLikeYn = likeYn;

        return { updatedLikeConut, updatedLikeYn};
        } catch (error) {
        console.error("Error during like API call: ", error);
        return likeCount;
        }


    };
  

    return { axiosLikeCall };
}
