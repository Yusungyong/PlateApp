import { useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileBucket } from '../../../../config/config';
import secureStorage from '../../../../services/storage/secureStorage';
import { useApiService } from '../../../../services/api/apiService';

export const useImageUpload = (setProfileImage) => {
  const modalRef = useRef();
  const { apiCall } = useApiService();

  const uploadImage = async (imageUri) => {
    try {
      // 토큰은 secureStorage에서, username은 AsyncStorage에서
      const tokens = await secureStorage.getItem<{ accessToken: string }>('tokens');
      const accessToken = tokens?.accessToken;
      const username = await AsyncStorage.getItem('username');
      if (!accessToken || !username) throw new Error('Missing authentication info');

      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      // ✅ apiCall로 업로드 (Content-Type/Authorization 자동)
      const data = await apiCall<any>({
        url: 'user-profile-image-upload',
        method: 'POST',
        data: formData,
      });

      if (data && data.imageUrl) {
        const s3Url = profileBucket + data.imageUrl;
        setProfileImage({ uri: s3Url });
        await AsyncStorage.setItem('profileImage', s3Url);
        if (modalRef.current && modalRef.current.showModal) {
          modalRef.current.showModal('프로필 이미지가 저장되었습니다.');
        }
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    }
  };

  return { uploadImage, modalRef };
};
