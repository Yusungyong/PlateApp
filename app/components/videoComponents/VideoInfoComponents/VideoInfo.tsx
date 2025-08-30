import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles';
import CustomModal from '../../../common/CustomModal';
import ProfileImage from '../../../common/imageUtil/ProfileImage';

const VideoInfo = ({ username, title, address, storeId, storeName, activeRegion, profileImageUrl }) => {
  const navigation = useNavigation();
  const modalRef = useRef();
  // 프로필 이미지나 username 탭 시 이동할 핸들러 (예: ReadUserProfile 컴포넌트)
  const handleProfilePress = () => {
    navigation.navigate('ReadUserProfile', {
      user: { username, profileImageUrl, activeRegion }
    });
  };
  return (
    <View style={styles.infoContainer}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity onPress={handleProfilePress}>
          <ProfileImage
                imageKey={profileImageUrl}
                size={50}
                style={styles.profileImage}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
      <View>
        <Text style={styles.videoTitle}>{storeName}</Text>
      </View>
      <Text style={styles.videoAddress}>{address}</Text>
      <CustomModal ref={modalRef} /> 
    </View>
  );
};

export default VideoInfo;
