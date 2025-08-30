import React from 'react';
import { View, TouchableOpacity, Dimensions, FlatList, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const { width: deviceWidth } = Dimensions.get('window');
const thumbnailHeight = deviceWidth * 1.5;

const VideoThumbnailList = ({ videoUrls, onPress, isActive, selectedIndex, setSelectedIndex }) => {
  const renderItem = ({ item, index }) => (
    <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => onPress(index)}>
      <View style={[styles.videoContainer, { width: deviceWidth, height: thumbnailHeight }]}>
        <Video
          source={{ uri: item }}
          style={styles.videoThumbnail}
          resizeMode="cover"
          repeat
          paused={!isActive || selectedIndex !== index}
          muted
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      pagingEnabled
      data={videoUrls}
      keyExtractor={(item, index) => `${item}_${index}`}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={e => {
        const index = Math.round(e.nativeEvent.contentOffset.x / deviceWidth);
        setSelectedIndex(index);
      }}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default VideoThumbnailList;
