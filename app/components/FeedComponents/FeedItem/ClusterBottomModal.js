import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useLikedUsers } from '../Hooks/feedItemHooks/useLikedUsers';
import { useNavigation } from '@react-navigation/native';
import BottomSlideModal from './BottomSlideModal';
import ProfileImage from '../../../common/imageUtil/ProfileImage'
import { timeAgo } from '../../../common/dataUtil/dateUtil';

const ClusterBottomModal = ({ visible, onClose, feedId, storeId }) => {
  const { likedUsers, fetchLikedUsers, loading } = useLikedUsers();
  const navigation = useNavigation();

  useEffect(() => {
    if (visible && (feedId || storeId)) {
      fetchLikedUsers(feedId, storeId);
    }
  }, [visible, feedId, storeId, fetchLikedUsers]);

  const handleProfilePress = (user) => {
    onClose();
    navigation.navigate('ReadUserProfile', {
      user: {
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        activeRegion: user.activeRegion,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProfilePress(item)} style={styles.userItem}>
      <ProfileImage imageKey={item.profileImageUrl} size={50} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <View style={styles.userRow}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.updatedAt}>{timeAgo(item.updatedAt)}</Text>
        </View>
        <Text style={styles.activeRegion}>
          {item.activeRegion || '활동지역이 등록되지 않은 사용자입니다.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSlideModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>이 게시글을 좋아한 사용자</Text>
      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : likedUsers?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>좋아요를 선택한 사용자가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={likedUsers}
          keyExtractor={(item) => item.id?.toString() || item.username}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </BottomSlideModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    color: 'gray',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  updatedAt: {
    fontSize: 12,
    color: '#888',
  },
  activeRegion: {
    fontSize: 14,
    color: 'gray',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClusterBottomModal;
