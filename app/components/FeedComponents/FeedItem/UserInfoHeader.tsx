import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ProfileImage from '../../../common/imageUtil/ProfileImage';
import { timeAgo } from '../../../common/dataUtil/dateUtil';

const UserInfoHeader = ({ feedData, onModalOpen }) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('ReadUserProfile', {
      user: {
        username: feedData.username,
        profileImageUrl: feedData.profileImageUrl,
        activeRegion: feedData.activeRegion,
      },
    });
  };

  return (
    <View style={styles.topRow}>
      {/* profileImage + userInfo를 한 번에 래핑 */}
      <TouchableOpacity 
        onPress={handleProfilePress}
        activeOpacity={0.75}
        style={styles.profileArea}
      >
        <ProfileImage
          imageKey={feedData.profileImageUrl}
          size={50}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{feedData.username}</Text>
          <Text style={styles.time}>{timeAgo(feedData.createdAt)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onModalOpen} style={styles.moreButton}>
        <Icon name="ellipsis-horizontal" size={24} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,             // 유저네임+사진이 가능한 한 넓게
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#111',
  },
  time: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default UserInfoHeader;
