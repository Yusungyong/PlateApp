import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';

export const useSubmitMenus = () => {
  const { apiCall } = useApiService();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const submitMenus = async (menus: { menuName: string; price: string }[], storeId: string | null) => {
    if (loading) return; // 중복 요청 방지
    setLoading(true);

    try {
      const existingStoreId = await AsyncStorage.getItem('storeId');
      if (!existingStoreId) {
        Alert.alert('알림', '어떤 항목의 메뉴인지 알 수 없습니다. 기본정보를 먼저 등록해주세요.');
        setLoading(false);
        return false;
      }

      const menuData = menus.map(menu => ({
        storeId,
        menuName: menu.menuName,
        price: menu.price,
      }));

      await apiCall({
        url: 'store-info-upload-5',
        method: 'POST',
        data: menuData,
      });

      Alert.alert('성공', '메뉴가 성공적으로 저장되었습니다.');
      setLoading(false);
      return true; // 성공 시 true 반환
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '메뉴 저장 중 문제가 발생했습니다.');
      setLoading(false);
      return false;
    }
  };

  return { submitMenus, loading };
};
