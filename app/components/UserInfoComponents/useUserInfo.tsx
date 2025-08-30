import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileBucket } from '../../config/config';
import { useApiService } from '../../services/api/apiService';
import secureStorage from '../../services/storage/secureStorage';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    region: '',
    createdAt: '',
    username: '',
    regCnt: '',
    feedCnt: '',    // feedCnt 기본값 추가
    videoCnt: '',   // videoCnt 기본값 추가
    code: '',
    nickName: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const { apiCall } = useApiService();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // accessToken은 secureStorage에서!
        const tokens = await secureStorage.getItem<{ accessToken: string }>('tokens');
        const accessToken = tokens?.accessToken;
        const username = await AsyncStorage.getItem('username');

        if (accessToken && username) {
          const data = await apiCall<any>({
            url: 'userInfo2',
            method: 'POST',
            data: { username }, // username JSON 형태로 보냄
          });

          if (data && data.profileImageUrl) {
            await AsyncStorage.setItem('profileImage', profileBucket + data.profileImageUrl);
            setProfileImage({ uri: profileBucket + data.profileImageUrl });
          }

          setUserInfo({
            region: data.region,
            createdAt: data.createdAt,
            username: data.username,
            regCnt: data.regCnt,
            code: data.code,
            nickName: data.nickName,
            feedCnt: data.feedCnt,
            videoCnt: data.videoCnt,
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, profileImage, setProfileImage };
};
