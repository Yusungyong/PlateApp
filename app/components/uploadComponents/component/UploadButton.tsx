import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiUrl, geoCodingApiKey } from '../../../config/config';
import { useApiService } from '../../../services/api/apiService'; // ✅

type UploadButtonProps = {
  file: any;
  thumbnail: any;
  restaurantAddress: string;
  title: string;
  selectedStoreName: string;
  selectedStoreTelNo: string;
  accessToken: string | null; // 앞으로 안써도 됨
  removeAudio: boolean;
  friend: string;
  setFile: (file: any) => void;
};

const GEOCODING_API_KEY = geoCodingApiKey;

const UploadButton: React.FC<UploadButtonProps> = ({
  file,
  thumbnail,
  restaurantAddress,
  title,
  selectedStoreName,
  selectedStoreTelNo,
  // accessToken,   // 사용 안함 (apiService에서 헤더 자동)
  removeAudio,
  setFile,
  friend,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { apiCall } = useApiService(); // ✅ apiService 사용

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODING_API_KEY}`
      );
      const data = await response.json();
      return data.status === 'OK' ? data : null;
    } catch {
      return null;
    }
  };

  const getAddressComponent = (components: any[], type: string) => {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : '';
  };

  const uploadFile = async () => {
    const existingStoreId = await AsyncStorage.getItem('storeId');
    if (existingStoreId) {
      Alert.alert('알림', '이미 등록된 항목입니다. 새로운 항목을 등록하려면 먼저 기존 정보를 삭제해주세요.');
      return;
    }

    if (!file) {
      Alert.alert('오류', '먼저 파일을 선택해주세요');
      return;
    }
    if (!restaurantAddress) {
      Alert.alert('오류', '주소를 입력해주세요');
      return;
    }

    const username = await AsyncStorage.getItem('username');
    if (!username) {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다');
      return;
    }

    setIsLoading(true);

    const processedFile = file;

    const geocodeResponse = await geocodeAddress(restaurantAddress);
    if (!geocodeResponse) {
      setIsLoading(false);
      Alert.alert('오류', '주소를 지오코딩할 수 없습니다');
      return;
    }

    const addressComponents = geocodeResponse.results[0].address_components;
    const geocodeData = {
      latitude: geocodeResponse.results[0].geometry.location.lat,
      longitude: geocodeResponse.results[0].geometry.location.lng,
      formattedAddress: geocodeResponse.results[0].formatted_address,
      placeId: geocodeResponse.results[0].place_id,
      streetNumber: getAddressComponent(addressComponents, 'street_number'),
      route: getAddressComponent(addressComponents, 'route'),
      locality: getAddressComponent(addressComponents, 'locality'),
      administrativeAreaLevel1: getAddressComponent(addressComponents, 'administrative_area_level_1'),
      administrativeAreaLevel2: getAddressComponent(addressComponents, 'administrative_area_level_2'),
      country: getAddressComponent(addressComponents, 'country'),
      postalCode: getAddressComponent(addressComponents, 'postal_code'),
      username: username,
    };

    const data = new FormData();
    data.append('file', {
      name: processedFile.fileName,
      type: processedFile.type,
      uri: processedFile.uri,
    });
    data.append('title', title);
    data.append('restaurantAddress', restaurantAddress);
    data.append('username', username);
    data.append('storeName', selectedStoreName);
    data.append('storeTelNo', selectedStoreTelNo);
    data.append('friend', friend);
    data.append('removeAudio', removeAudio ? 'Y' : 'N');

    if (thumbnail) {
      data.append('thumbnail', {
        name: 'thumbnail.jpg',
        type: 'image/jpeg',
        uri: thumbnail,
      });
    }

    try {
      // ✅ apiCall로 파일 업로드 (헤더 따로 X)
      const response = await apiCall({
        url: 'store-info-upload',
        method: 'POST',
        data,
      });

      // 서버에서 200 응답이어야 정상
      if (response && typeof response === 'string') {
        const storeId = response;

        // 지오코딩 정보 업로드 (JSON)
        await apiCall({
          url: 'geocoding-info-upload',
          method: 'POST',
          data: { ...geocodeData, storeId },
        });

        await AsyncStorage.setItem('storeId', storeId);
        setIsLoading(false);
        Alert.alert('성공', '파일이 성공적으로 업로드되었습니다', [
          {
            text: '확인',
            onPress: () => navigation.navigate('홈'),
          },
        ]);
      } else {
        throw new Error('파일 업로드 실패');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('오류', '파일 업로드에 실패했습니다');
      console.error(error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <TouchableOpacity style={styles.button} onPress={uploadFile}>
      <Text style={styles.buttonText}>완료</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF7F50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadButton;
