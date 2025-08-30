import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { timeAgo } from '../../../../common/dataUtil/dateUtil';
import { useNavigation } from '@react-navigation/native';
import ProfileImage from '../../../../common/imageUtil/ProfileImage';
import ClusterModal from '../../FeedItem/ClusterModal';

const VideoItemHeader = ({ videoData, currentUser, onModalOpen }) => {
  const navigation = useNavigation();

  const [clusterModalVisible, setClusterModalVisible] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState(null);

  const handleProfilePress = () => {
    navigation.navigate('ReadUserProfile', {
      user: {
        username: videoData.username,
        profileImageUrl: videoData.profileImageUrl,
        activeRegion: videoData.activeRegion,
      },
    });
  };

  const handleLocationPress = useCallback(() => {
    navigation.navigate('지도', {
      initialLatitude: videoData.latitude,
      initialLongitude: videoData.longitude,
      initialLatitudeDelta: 0.005,
      initialLongitudeDelta: 0.005,
    });
  }, [navigation, videoData]);

  const handleStoreNamePress = useCallback(() => {
    setSelectedPlaceId(videoData.storeId);
    setSelectedStoreName(videoData.storeName);
    setClusterModalVisible(true);
  }, [videoData]);

  const getFormattedLocation = (location) => {
    if (!location) return '';
    const words = location.split(' ');
    return words.slice(0, 3).join(' ');
  };

  const handleMorePress = () => {
    if (onModalOpen) onModalOpen(videoData);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={handleProfilePress}>
            <ProfileImage
              imageKey={videoData.profileImageUrl}
              size={50}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleProfilePress}>
              <Text style={styles.feedTitle}>{videoData.username}</Text>
            </TouchableOpacity>
            {videoData.createdAt && (
              <Text style={styles.time}>{timeAgo(videoData.createdAt)}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleMorePress}>
            <Icon name="more-horiz" size={24} color="gray" style={styles.moreIcon} />
          </TouchableOpacity>
        </View>

        {videoData.address && (
          <View style={styles.locationRow}>
            <TouchableOpacity onPress={handleLocationPress} style={styles.locationTouchable}>
              <Icon name="place" size={14} color="black" />
              <Text style={styles.locationText}>{getFormattedLocation(videoData.address)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStoreNamePress}>
              <Text style={styles.storeNameText} numberOfLines={1} ellipsizeMode="tail">
                {videoData.storeName}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {clusterModalVisible && (
        <ClusterModal
          visible={clusterModalVisible}
          onClose={() => setClusterModalVisible(false)}
          placeId={selectedPlaceId}
          storeId={videoData.storeId}
          storeName={selectedStoreName}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 10,
    flexDirection: 'column',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  feedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  moreIcon: {
    padding: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  locationTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 4,
  },
  storeNameText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default VideoItemHeader;