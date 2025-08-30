import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import { usePlayHooks } from './videoComponetHooks/playHooks';
import MenuBar from './MenuComponents/MenuBar';
import VideoInfo from './VideoInfoComponents/VideoInfo';
import CommentModal from './commentComponents/CommentModal';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // ← 아이콘 사용 추천

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoItem = memo(function VideoItem({
  item,
  isActive,
  isFocused,
  handleCommentPress,
  navigation,
  containerHeight,
}) {
  const [paused, setPaused] = useState(true);
  console.log('VideoItem item:', item);
  useEffect(() => {
    setPaused(!(isActive && isFocused));
  }, [isActive, isFocused]);

  const togglePause = useCallback(() => {
    if (isActive && isFocused) setPaused((prev) => !prev);
  }, [isActive, isFocused]);

  return (
    <View style={[styles.videoContainer, { height: containerHeight }]}>
      <TouchableWithoutFeedback onPress={togglePause}>
        <Video
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          paused={paused}
          repeat
        />
      </TouchableWithoutFeedback>

      <View style={styles.videoInfoOverlay}>
        <VideoInfo
          username={item.username}
          title={item.title}
          address={item.address}
          storeId={item.storeId}
          storeName={item.storeName}
          profileImageUrl={item.profileImageUrl}
        />
      </View>

      <View style={styles.menuBarOverlay}>
        <MenuBar
          item={item}
          navigation={navigation}
          onCommentPress={() => handleCommentPress(item)}
        />
      </View>
    </View>
  );
});

const PlayContents = ({ route, navigation }) => {
  const {
    storeId = null,
    passedUsername = null,
    scrollToCommentId = null,
    scrollToReplyId = null,
  } = route?.params || {};

  const {
    videoData,
    loading,
    error,
    fetchVideoData,
    hasMoreData,
  } = usePlayHooks(storeId, passedUsername);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideoInfo, setCurrentVideoInfo] = useState({ storeId: null, username: '' });
  const [containerHeight, setContainerHeight] = useState(SCREEN_HEIGHT);
  const [isCommentModalVisible, setCommentModalVisible] = useState(
    !!scrollToCommentId || !!scrollToReplyId
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchVideoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      const index = viewableItems?.[0]?.index ?? 0;
      setCurrentIndex(index);
      if (index >= videoData.length - 2 && hasMoreData) {
        fetchVideoData();
      }
    },
    [fetchVideoData, videoData, hasMoreData]
  );
  
  const handleCommentPress = useCallback((item) => {
    setCurrentVideoInfo({ storeId: item.storeId, username: item.username });
    setCommentModalVisible(true);
  }, []);

  if (loading && videoData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVideoData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (videoData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>현재 등록된 영상이 없습니다.</Text>
      </View>
    );
  }

  return (
    <>
      {/* 뒤로가기 버튼 (좌측 상단) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Icon name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View
        style={{ flex: 1 }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setContainerHeight(height);
        }}
      >
        <FlatList
          data={videoData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <VideoItem
              item={item}
              index={index}
              isActive={currentIndex === index}
              isFocused={isFocused}
              handleCommentPress={handleCommentPress}
              navigation={navigation}
              containerHeight={containerHeight}
            />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          initialNumToRender={3}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={{ paddingBottom: 0 }}
          getItemLayout={(_, index) => ({
            length: containerHeight,
            offset: containerHeight * index,
            index,
          })}
        />
      </View>

      <CommentModal
        visible={isCommentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        storeId={currentVideoInfo.storeId}
        scrollToCommentId={scrollToCommentId}
        scrollToReplyId={scrollToReplyId}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 18,
    padding: 6,
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoInfoOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    zIndex: 1,
    padding: 10,
    width: 350,
    borderRadius: 8,
  },
  menuBarOverlay: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '20%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#444',
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PlayContents;
