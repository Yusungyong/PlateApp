import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUserInfo } from './useUserInfo';
import { useImageUpload } from './UserProfileComponents/ProfileSection/useImageUpload';
import UserProfile from './UserProfileComponents/ProfileSection/UserProfile';
import PostList from './UserPostComponents/PostList';
import CommonLayout from '../../common/CommonLayout';
import CustomModal from '../../common/CustomModal';

const UserInfoContents = () => {
  const { userInfo, profileImage, setProfileImage } = useUserInfo();
  const { uploadImage, modalRef } = useImageUpload(setProfileImage);
  console.log(userInfo, profileImage);
  const handleImagePicker = async () => {
    const options = { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 };
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0].uri) {
        uploadImage(response.assets[0].uri);
      }
    });
  };

  // 데이터 배열 구성: 첫 아이템은 프로필, 두 번째 아이템은 게시글 리스트
  const data = [
    { type: 'profile', key: 'profile' },
    { type: 'posts', key: 'posts' }
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'profile') {
      return (
        <UserProfile
          userInfo={userInfo}
          profileImage={profileImage}
          onImagePicker={handleImagePicker}
        />
      );
    } else if (item.type === 'posts') {
      return <PostList />;
    }
    return null;
  };

  return (
    <CommonLayout>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.flatListContainer}
        />
        <CustomModal ref={modalRef} />
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  flatListContainer: { paddingBottom: 60 },
});

export default UserInfoContents;
