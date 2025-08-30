import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BottomSlideModal from './BottomSlideModal';

const LikedUsersModal = ({ visible, onClose, likedUsers, loading }) => {
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.username}>{item.username}</Text>
    </View>
  );

  return (
    <BottomSlideModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>좋아요 누른 사용자</Text>
      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : likedUsers?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 좋아요가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={likedUsers}
          keyExtractor={(item) => item.id?.toString() || item.username}
          renderItem={renderItem}
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
    paddingVertical: 8,
  },
  username: {
    fontSize: 16,
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

export default LikedUsersModal;
