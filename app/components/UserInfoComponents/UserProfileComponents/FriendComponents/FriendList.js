import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import useDeleteFriendHook from './Hooks/DeleteFriendHook';
import FriendItem from './FriendItem.js';
import { useApiService } from '../../../../services/api/apiService';

const FriendList = () => {
  const { apiCall } = useApiService();
  const { deleteFriend } = useDeleteFriendHook();

  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFriendList = async () => {
    try {
      setLoading(true);
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) throw new Error('사용자 정보 없음');

      const response = await apiCall({
        method: 'POST',
        url: '/user-friend-list2',
        data: { username: storedUsername },
      });

      setFriendList(response);
    } catch (err) {
      console.error(err);
      setError(err.message);
      Alert.alert('에러', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendList();
  }, []);

  const handleDelete = useCallback((friendName) => {
    deleteFriend(friendName);
    setFriendList((prev) => prev.filter((f) => f.friendName !== friendName));
    Toast.show({ type: 'success', text1: '삭제 완료!' });
  }, [deleteFriend]);

  if (loading) return <ActivityIndicator size="large" color="#FF7F50" />;
  if (error) return <Text style={styles.error}>에러: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={friendList}
        keyExtractor={(item) => item.friendName}
        renderItem={({ item }) => (
          <FriendItem friend={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<Text style={styles.noResults}>친구 목록이 없습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default FriendList;
