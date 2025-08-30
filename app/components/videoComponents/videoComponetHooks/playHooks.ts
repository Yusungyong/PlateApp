import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';
import { useState, useCallback, useRef } from 'react';
import { videoBucket } from '../../../config/config';
import { pl } from 'date-fns/locale';

interface VideoItem {
    id: string;
    url: string;
    title: string;
    username: string;
    storeId: string;
    address: string;
    likeCount: number;
    likeYn: string;
    commentCount: number;
    profileImageUrl: string;
    createdAt: string; // createdAt 필드 추가
}

export const usePlayHooks = (storeId: number, passedUsername?: string) => {
    const dispatch = useDispatch();
    const { apiCall, invalidateCache } = useApiService();
    const [videoData, setVideoData] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMoreData, setHasMoreData] = useState(true); // 더 가져올 데이터 여부
    const [page, setPage] = useState(1); // 페이징 처리
    const loadingRef = useRef(false); // 중복 호출 방지 플래그

    const fetchVideoData = useCallback(async () => {
        if (loading || loadingRef.current || !hasMoreData) return; // 중복 호출 방지
        loadingRef.current = true;
        try {
            setLoading(true);
            setError(null);

            // 로컬 스토리지에서 username을 가져옵니다.
            const localUsername = await AsyncStorage.getItem('username');

            // passedUsername과 localUsername을 각각 별도로 requestBody에 포함합니다.
            const requestBody = {
                limit: passedUsername === 'noti' ? 1 : 10,
                offset: (page - 1) * 10, // 페이징 계산
                requestUsername: passedUsername, // 인자값으로 전달된 username
                username: localUsername, // AsyncStorage에서 가져온 username
                mapStoreId: storeId,
            };

            invalidateCache('read-video-info');

            const response = await apiCall({
                url: 'read-video-info',
                method: 'POST',
                data: requestBody,
            });

            if (response.length === 0) {
                setHasMoreData(false); // 더 이상 데이터 없음
                return;
            }

            const formattedData = response.map((item: any, index: number) => ({
                id: `${videoData.length + index}-${item.fileName}`, // 고유 ID 생성
                url: `${videoBucket}${item.fileName}`,
                title: item.title,
                username: item.username, // response의 username 필드는 그대로 유지
                storeId: item.storeId,
                address: item.address,
                latitude: item.latitude,   // 위도 추가
                longitude: item.longitude, // 경도 추가
                likeCount: item.likeCount || 0,
                likeYn: item.likeYn || 'N',
                commentCount: item.commentCount || 0,
                storeName: item.storeName,
                profileImageUrl: item.profileImageUrl,
                createdAt: item.createdAt, // createdAt 필드 추가
                targetFlag: item.targetFlag,
                placeId: item.placeId, // placeId 필드 추가
            }));

            setVideoData((prevData) => {
                const existingIds = new Set(prevData.map((item) => item.id));
                const newData = formattedData.filter((item) => !existingIds.has(item.id));
                return [...prevData, ...newData];
            });

            setPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
        } catch (err: any) {
            setError(err.message || 'Failed to fetch video data.');
            console.error('Error fetching video info:', err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [storeId, passedUsername, invalidateCache, videoData, page, hasMoreData]);

    return { videoData, loading, error, fetchVideoData, setVideoData, hasMoreData };
};
