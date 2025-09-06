import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const UserAvatar = ({ profileImage, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      accessibilityLabel="프로필 이미지 변경"
      accessible
    >
      {profileImage ? (
        <Image source={profileImage} style={styles.image} />
      ) : (
        <Icon name="person-circle-outline" size={90} color="#FF7F50" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    padding: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FF7F50',
  },
});

export default UserAvatar;
