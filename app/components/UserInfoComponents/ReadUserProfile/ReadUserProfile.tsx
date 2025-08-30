import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ 변경
import useUserProfilePodlist from './useUserProfilePodList';
import UserProfileHeader from './UserProfileHeader';
import ProfileImageModal from './ProfileImageModal';
import PostGrid from './PostGrid';      
import FeedGrid from './FeedGrid';      
import UserMapView from './UserMapView'; 

const ReadUserProfile = ({ route, navigation }) => {
  const username = route.params?.user?.username;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'video' | 'feed' | 'map'>('video');
  const { data, loading, error, createUserProfilePodlist } = useUserProfilePodlist();

  useEffect(() => {
    createUserProfilePodlist(username).catch(console.error);
  }, []);

  const user = data?.user;
  const videos = data?.videos || [];
  const feeds = data?.feeds || [];

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {user && (
        <UserProfileHeader
          user={user}
          selectedTab={selectedTab}
          onProfileImagePress={() => setModalVisible(true)}
          onTabPress={setSelectedTab}
        />
      )}

      {selectedTab === 'video' && (
        <PostGrid
          posts={videos}
          loading={loading}
          error={error}
          onPress={post =>
            navigation.navigate('재생', {
              storeId: post.storeId,
              passedUsername: post.username,
            })
          }
        />
      )}

      {selectedTab === 'feed' && (
        <FeedGrid
          feeds={feeds}
          loading={loading}
          error={error}
          onPress={feed =>
            navigation.navigate('FeedImageViewer', {
              feedId: feed.feedId, username : 'su12ng'
            })
          }
        />
      )}

      {selectedTab === 'map' && user && (
        <UserMapView
          latitude={user.latitude}
          longitude={user.longitude}
          regionName={user.activeRegion}
          markerLabel={user.nickName}
        />
      )}

      <ProfileImageModal
        visible={modalVisible}
        imageUrl={user?.profileImageUrl}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 52 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
    
  },
});

export default ReadUserProfile;
