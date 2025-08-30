import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { profileBucket } from '../../../../config/config';
import useVisitFriend from './useVisitFriend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FriendItem = ({ friend, onDelete, onPress }) => {
  // friendName이 null, undefined, 혹은 빈 문자열인 경우 표시하지 않음
  if (!friend?.friendName) {
    return null;
  }

  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { visitFriend } = useVisitFriend();

  const renderProfileImage = () => {
    return friend.profileImageUrl ? (
      <FastImage
        style={styles.profileImage}
        source={{ uri: `${profileBucket}${friend.profileImageUrl}` }}
        resizeMode={FastImage.resizeMode.cover}
      />
    ) : (
      <View style={styles.profileImage}>
        <Ionicons name="person-circle-outline" size={46} color="#FF7F50" />
      </View>
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      '친구 삭제',
      `${friend.friendName}님을 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDelete(friend.friendName));
  };

  const handleItemPress = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('에러', '사용자 정보가 없습니다.');
        return;
      }

      const res = await visitFriend({
        friendName: friend.friendName,
        username,
      });

      if (res) {
        const newVisitData = res.map((item) => ({
          ...item,
          friendProfileImageUrl: friend.profileImageUrl,
          friendName: friend.friendName,
        }));

        navigation.navigate('VisitHistoryScreen', { visitData: newVisitData });
      }
    } catch (error) {
      console.error('handleItemPress error:', error);
    }

    if (onPress) {
      onPress(friend);
    }
  };

  return (
    <Animated.View
      style={[styles.friendContainer, { transform: [{ translateX: slideAnim }] }]}
    >
      <TouchableOpacity style={styles.touchArea} activeOpacity={0.7} onPress={handleItemPress}>
        {renderProfileImage()}
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{friend.friendName}</Text>
          <Text style={styles.friendRegion}>{friend.activeRegion}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  touchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  friendRegion: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default FriendItem;
