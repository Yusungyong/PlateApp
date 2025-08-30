
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const getUsername = () => {
  const [username, setUsername] = useState(null);


  // 로컬 스토리지에서 username 가져오기
  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        Alert.alert('오류', '사용자 이름을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('로컬 스토리지에서 username 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  return username;
}


export default getUsername;