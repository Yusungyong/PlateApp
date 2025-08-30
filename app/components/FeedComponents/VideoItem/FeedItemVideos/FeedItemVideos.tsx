import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import VideoThumbnailList from './VideoThumbnailList';
import { useNavigation } from '@react-navigation/native';

const { width: deviceWidth } = Dimensions.get('window');
const thumbnailHeight = deviceWidth * 1.5;

const FeedItemVideos = ({ videos, storeId, isActive }) => {
  const videoUrls = useMemo(() => videos?.split(', ') || [], [videos]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();
  if (!videoUrls.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <VideoThumbnailList
        videoUrls={videoUrls}
        onPress={index => {
          setSelectedIndex(index); // 썸네일 하이라이트 등에 필요하면 유지
          navigation.navigate('재생', {
            storeId,
            initialIndex: index,   // 누른 썸네일 인덱스
            videoUrls,             // 전체 비디오 목록
          });
        }}
        isActive={isActive}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      <View style={styles.videoCountContainer}>
        <Text style={styles.videoCountText}>
          {`${selectedIndex + 1} / ${videoUrls.length}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative', marginTop: 10 },
  loadingContainer: {
    height: thumbnailHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCountContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoCountText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default FeedItemVideos;
