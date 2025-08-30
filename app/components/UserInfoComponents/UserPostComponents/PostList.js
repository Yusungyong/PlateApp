import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostListContent from './PostListContent';
import LikedPosts from './LikedPosts';
import FeedListContent from './PlateCard/FeedListContent';
import { podsListStyles } from '../../../styles/UserInfoStyle';

const TABS = ['영상', '피드', '좋아요'];

const PostList = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('영상');
  const [tabWidths, setTabWidths] = useState({});
  const [tabPositions, setTabPositions] = useState({});
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const animatedLeft = useRef(new Animated.Value(0)).current;
  const [currentUsername, setCurrentUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        setCurrentUsername(username);
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const index = TABS.indexOf(selectedTab);
    if (tabWidths[index] && tabPositions[index] !== undefined) {
      setUnderlineWidth(tabWidths[index]);
      Animated.timing(animatedLeft, {
        toValue: tabPositions[index],
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [tabWidths, tabPositions, selectedTab]);

  const handleTabPress = (tabName, index) => {
    setSelectedTab(tabName);
  };

  const measureTab = (event, index) => {
    const { width, x } = event.nativeEvent.layout;
    setTabWidths((prev) => ({ ...prev, [index]: width }));
    setTabPositions((prev) => ({ ...prev, [index]: x }));
  };

  const handleThumbnailPress = (item) => {
    navigation.navigate('재생', { storeId: item.storeId, passedUsername: currentUsername });
  };

  const TAB_CONTENT = {
    '영상': <PostListContent onThumbnailPress={handleThumbnailPress} />,
    '피드': <FeedListContent />,
    '좋아요': <LikedPosts />,
  };

  return (
    <View style={podsListStyles.container}>
      <View style={podsListStyles.tabRow}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={podsListStyles.tabButton}
            onLayout={(e) => measureTab(e, index)}
            onPress={() => handleTabPress(tab, index)}
          >
            <Text style={[podsListStyles.tabText, selectedTab === tab && podsListStyles.selectedTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[podsListStyles.underline, { left: animatedLeft, width: underlineWidth }]}
        />
      </View>
      {TAB_CONTENT[selectedTab]}
    </View>
  );
};

export default PostList;