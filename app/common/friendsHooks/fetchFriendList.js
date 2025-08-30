import { useState, useEffect } from "react";
import { Alert } from "react-native"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from "../../services/api/apiService";

const useFriendList = () => {

  const [friendList, setFriendList] = useState([]);

  const fetchFriendList = async () => {
    const { apiCall } = useApiService();
      const username = AsyncStorage.getItem(username);
        try {
          const response = await apiCall({
            method: 'POST',
            url: '/user-friend-list',
            data: { username },
          });
    
          if (Array.isArray(response)) {
            setFriendList(response); // 모든 친구 목록 저장
          } else {
            Alert.alert('오류', '유효하지 않은 친구 목록 데이터 형식입니다.');
          }
        } catch (error) {
          console.error('친구 목록 요청 중 오류 발생:', error);
        }
      };

      // useEffect(() => {
      //   if(username){
      //     fetchFriendList();
      //   }
      // }, [username]); 

      return { friendList, refetch : fetchFriendList };

}

export default useFriendList;