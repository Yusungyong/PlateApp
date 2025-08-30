import { useState } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService'; // ✅
import secureStorage from '../../../services/storage/secureStorage'; // ✅

export const useUploadFile = () => {
  const [file, setFile] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { apiCall } = useApiService();

  const selectFile = () => {
    setIsLoading(true);
    launchImageLibrary({ mediaType: 'video' }, async (response) => {
      if (response.didCancel) {
        setIsLoading(false);
      } else if (response.errorCode) {
        setIsLoading(false);
      } else {
        const selectedFile = response.assets[0];
        setFile(selectedFile);

        try {
          const thumbnailResult = await createThumbnail({ url: selectedFile.uri });
          setThumbnail(thumbnailResult);
        } catch (error) {
          console.error('썸네일 생성 오류: ', error);
        }
        setIsLoading(false);
      }
    });
  };

  const uploadFile = async ({
    title,
    restaurantAddress,
    storeName,
    storeTelNo,
    geocodeData,
  }) => {
    const existingStoreId = await AsyncStorage.getItem('storeId');
    if (existingStoreId) {
      Alert.alert('알림', '이미 등록된 항목입니다. 기존 정보를 삭제해주세요.');
      return false;
    }
    if (!file || !restaurantAddress) {
      Alert.alert('오류', '파일과 주소를 입력해주세요.');
      return false;
    }

    // 토큰은 secureStorage에서, username은 AsyncStorage에서!
    const tokens = await secureStorage.getItem<{ accessToken: string }>('tokens');
    const accessToken = tokens?.accessToken;
    const username = await AsyncStorage.getItem('username');
    if (!accessToken || !username) {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
      return false;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('file', { name: file.fileName, type: file.type, uri: file.uri });
    data.append('title', title);
    data.append('restaurantAddress', restaurantAddress);
    data.append('username', username);
    data.append('storeName', storeName);
    data.append('storeTelNo', storeTelNo);

    if (thumbnail) {
      data.append('thumbnail', { name: 'thumbnail.jpg', type: 'image/jpeg', uri: thumbnail.path });
    }

    try {
      // ✅ 파일 업로드 (apiCall)
      const storeId = await apiCall<string>({
        url: 'store-info-upload',
        method: 'POST',
        data,
        // headers: { ... } // Content-Type 지정하지 말 것!
      });

      // ✅ 지오코딩 정보 업로드 (JSON)
      await apiCall({
        url: 'geocoding-info-upload',
        method: 'POST',
        data: { ...geocodeData, storeId },
      });

      setIsLoading(false);
      Alert.alert('성공', '파일이 성공적으로 업로드되었습니다.');
      await AsyncStorage.setItem('storeId', storeId);
      return true;
    } catch (error) {
      setIsLoading(false);
      Alert.alert('오류', '파일 업로드에 실패했습니다.');
      console.error(error);
      return false;
    }
  };

  return { file, thumbnail, isLoading, selectFile, uploadFile };
};
