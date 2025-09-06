import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../services/api/apiService';
import CommonLayout from '../../../../common/CommonLayout'; // ✅ 공통 레이아웃 import

const BlockedUserList = () => {
  const { apiCall } = useApiService();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        setBlockedUsers([]);
        return;
      }

      const res = await apiCall({
        method: 'GET',
        url: '/user-block-list',
        params: { blockerUsername: username },
      });

      console.log('✅ 차단 목록 응답:', res);

      if (Array.isArray(res)) {
        setBlockedUsers(res);
      } else {
        setBlockedUsers([]);
      }
    } catch (error) {
      console.error('차단된 사용자 목록 로딩 실패:', error);
      Alert.alert('오류', '차단된 사용자 목록을 불러오는 데 실패했습니다.');
      setBlockedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockedUsername: string) => {
    Alert.alert(
      '차단 해제 확인',
      `${blockedUsername} 님을 차단 해제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            try {
              const blockerUsername = await AsyncStorage.getItem('username');
              if (!blockerUsername) throw new Error('차단자 정보 없음');

              await apiCall({
                method: 'POST',
                url: '/user-unblock',
                data: { blockerUsername, blockedUsername },
              });

              setBlockedUsers((prev) =>
                prev.filter((user) => user.blockedUsername !== blockedUsername)
              );
              Alert.alert('완료', '차단이 해제되었습니다.');
            } catch (error) {
              console.error('차단 해제 실패:', error);
              Alert.alert('오류', '차단 해제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.blockedUsername?.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.blockedUsername}</Text>
        <Text style={styles.blockedAt}>
          차단일: {new Date(item.blockedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item.blockedUsername)}
      >
        <Text style={styles.unblockButtonText}>차단 해제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>차단된 사용자 목록</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 30 }} />
        ) : blockedUsers.length === 0 ? (
          <Text style={styles.emptyText}>차단된 사용자가 없습니다.</Text>
        ) : (
          <FlatList
            data={blockedUsers}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20, // ✅ CommonHeader가 있으니 80 → 20으로 조정
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7F50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  blockedAt: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  unblockButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unblockButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default BlockedUserList;
