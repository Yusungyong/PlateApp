import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resizeImage } from '../../../../common/resizeImage';
import { useApiService } from '../../../../services/api/apiService';
import useGeocoding from '../../../../common/useGeocoding';

interface PostData {
  title?: string; // 선택적 (원한다면 필수로 바꿔도 됨)
  content: string;
  friend: string; // ✅ 친구 이름을 문자열로 받음 ("민수, 수진")
  images: string[];
  location: string | null;
  selectedStoreName: string | null;
  tags: string | null;
}

export const useCreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { apiCall } = useApiService();
  const { geocodeAddress } = useGeocoding();

  const createPost = async ({
    title = '',
    content,
    friend,
    images,
    location,
    selectedStoreName,
    tags,
  }: PostData) => {
    try {
      const username = await AsyncStorage.getItem('username');

      if (!content) {
        Alert.alert('입력 오류', '피드 내용을 작성해주세요.');
        return;
      }

      setIsSubmitting(true);

      // 1. 이미지 압축
      let compressedImages: string[] = [];
      if (images && images.length > 0) {
        compressedImages = await Promise.all(
          images.map(async (imageUri) => await resizeImage(imageUri))
        );
      }

      // 2. FormData 구성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('friend', friend); // ✅ 친구 문자열 추가
      formData.append('username', username || '');
      formData.append('location', location || '');
      formData.append('storeName', selectedStoreName || '');
      formData.append('tags', tags || '');
      
      if (compressedImages.length > 0) {
        compressedImages.forEach((imageUri, index) => {
          formData.append('images', {
            uri: imageUri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          } as any);
        });
      }

      // 3. 글 등록 요청
      const createFeedResponse = await apiCall({
        method: 'POST',
        url: 'create-feed',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const feedId = createFeedResponse;

      // 4. 지오코딩 정보 업로드 (위치 있을 경우)
      if (location && feedId !== 0) {
        const geocodeResult = await geocodeAddress(location);
        if (geocodeResult) {
          await apiCall({
            method: 'POST',
            url: 'geocoding-info-upload',
            data: {
              ...geocodeResult,
              feedId,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } else {
          Alert.alert('지오코딩 오류', '주소 정보를 업로드하지 못했습니다.');
        }
      }

      return createFeedResponse;
    } catch (error) {
      console.error('글 작성 오류:', error);
      Alert.alert('오류', '글 작성 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createPost, isSubmitting };
};
