import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileBucket } from '../../../../config/config';
import useRegistryFriendHook from './Hooks/RegistryFriendHook';
import { useBlockUser } from '../../../FeedComponents/FeedItem/useBlockUser';
import CustomModal from '../../../../common/CustomModal';

const SearchResultsList = ({ results, onAddFriend }) => {
  const { addFriend } = useRegistryFriendHook();
  const { blockUser } = useBlockUser();
  const [searchResults, setSearchResults] = useState(results);
  const modalRef = useRef();

  useEffect(() => {
    setSearchResults(results);
  }, [results]);

  const renderProfileImage = (imageUrl) => {
    if (imageUrl) {
      return (
        <FastImage
          style={styles.profileImage}
          source={{ uri: `${profileBucket}${imageUrl}` }}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }
    return <Ionicons name="person-circle-outline" size={50} color="#FF7F50" />;
  };

  const handleAddFriend = async (username) => {
    const success = await addFriend(username);
    if (success) {
      setSearchResults((prev) =>
        prev.filter((user) => user.username !== username)
      );
      modalRef.current.showModal('친구등록 되었습니다');
      onAddFriend();
    }
  };

  const handleUserBlock = async (blockedUsername) => {
    try {
      const blockerUsername = await AsyncStorage.getItem('username');
      const blockedAt = new Date().toISOString();

      const res = await blockUser({
        blockerUsername,
        blockedUsername,
        blockedAt,
      });

      modalRef.current.showModal('사용자가 차단되었습니다');
      setSearchResults((prev) =>
        prev.filter((user) => user.username !== blockedUsername)
      );
    } catch (error) {
      console.error('차단 중 오류:', error);
      modalRef.current.showModal('차단 중 오류가 발생했습니다');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      {renderProfileImage(item.profileImageUrl)}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userRegion}>{item.activeRegion}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddFriend(item.username)}
      >
        <Text style={styles.addButtonText}>추가</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          Alert.alert(
            '사용자 차단',
            '차단된 사용자의 게시물을 확인할 수 없게됩니다.\n진행할까요?\n(차단된 사용자 목록은 사용자 옵션메뉴에서 확인할 수 있습니다.)',
            [
              { text: '취소', style: 'cancel' },
              {
                text: '확인',
                onPress: () => handleUserBlock(item.username),
                style: 'destructive',
              },
            ]
          )
        }
      >
        <Text style={styles.addButtonText}>차단</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionTitle}>검색된 사용자</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => item.username + index}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
      <CustomModal ref={modalRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FF7F50',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRegion: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SearchResultsList;
