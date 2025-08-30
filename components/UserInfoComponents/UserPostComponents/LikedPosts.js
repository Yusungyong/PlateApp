import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';
import { imageBucket, videoBucket } from '../../../app/config/config';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { requestAndFetchLocation } from '../../../common/locationUtils';
import { likePodsStyles } from '../../../app/styles/UserInfoStyle';
import ClusterBottomModal from '../../FeedComponents/FeedItem/ClusterBottomModal';

const LikedPosts = ({ onThumbnailPress }) => {
  const { apiCall } = useApiService();
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClusterModalVisible, setClusterModalVisible] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    requestAndFetchLocation(setLocation, setError);

    const timeout = setTimeout(() => {
      if (location.latitude === null || location.longitude === null) {
        setError(null); // 위치 에러는 전체 목록 표시엔 영향 없도록 무시
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError('로그인이 필요합니다.');
          setLoading(false);
        }
      } catch (err) {
        console.error('오류 발생:', err);
        setError('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (!username) return;
      try {
        setLoading(true);
        const payload = {
          username,
          ...(location.latitude !== null && location.longitude !== null && {
            userLat: location.latitude,
            userLon: location.longitude,
          }),
        };

        const data = await apiCall({
          method: 'POST',
          url: '/user-like-list',
          data: payload,
        });

        if (Array.isArray(data)) setLikedItems(data);
        else throw new Error('서버에서 잘못된 데이터 형식이 반환되었습니다.');
      } catch (err) {
        setError(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedItems();
  }, [username, location]);

  const handleUnlike = async (storeId) => {
    try {
      await apiCall({ method: 'POST', url: '/video-like', data: { username, storeId, useYn: 'N' } });
      setLikedItems(prev => prev.filter(item => item.storeId !== storeId));
    } catch (err) {
      console.error('좋아요 취소 오류:', err);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  const formatDate = (date) => (date ? format(new Date(date), 'yyyy-MM-dd HH:mm') : '날짜 정보 없음');

  const handlePress = (index) => setSelectedIndex(index);
  const handleLikeCountPress = (storeId) => {
    setSelectedStoreId(storeId);
    setClusterModalVisible(true);
  };

  const renderItem = (item, index) => {
    const parts = item.address?.split(' ') || [];
    const displayAddress = `${parts[1] || ''} ${parts[2] || ''}`.trim();

    return (
      <TouchableOpacity
        key={`${item.storeId}-${index}`}
        style={[likePodsStyles.cardContainer, selectedIndex === index && likePodsStyles.selectedItemContainer]}
        onPress={() => handlePress(index)}
        activeOpacity={1}
      >
        {selectedIndex === index ? (
          <Video
            source={{ uri: videoBucket + item.fileName }}
            style={likePodsStyles.video}
            resizeMode="cover"
            controls
            paused={false}
            repeat
            onError={() => Alert.alert('비디오 로드 오류', '비디오를 불러오는 데 실패했습니다.')}
          />
        ) : (
          <FastImage
            source={{ uri: imageBucket + item.thumbnail }}
            style={likePodsStyles.image}
            resizeMode={FastImage.resizeMode.cover}
            onError={() => Alert.alert('이미지 로드 오류', '이미지를 불러오는 데 실패했습니다.')}
          />
        )}

        <View style={likePodsStyles.textContainer}>
          <View style={likePodsStyles.storeAndLikeContainer}>
            <Text style={likePodsStyles.storeName}>{item.storeName || '가게 이름 없음'}</Text>
            <View style={likePodsStyles.likeWrapper}>
              <TouchableOpacity onPress={() => handleUnlike(item.storeId)} style={likePodsStyles.heartContainer}>
                <Icon name="heart" size={16} color="#FF0000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLikeCountPress(item.storeId)} style={likePodsStyles.likeCountContainer}>
                <Text style={likePodsStyles.likeCount}>{item.likeCount || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={likePodsStyles.distance}>
            {item.distance && item.address
              ? `${displayAddress} [${item.distance}]`
              : item.address
                ? displayAddress
                : '거리 정보 없음'}
          </Text>

          <View style={likePodsStyles.userAndDateContainer}>
            <Text style={likePodsStyles.username}>작성자: {item.username || '익명'}</Text>
            <View style={likePodsStyles.dateContainer}>
              <Icon name="time-outline" size={14} color="#FF7F50" />
              <Text style={likePodsStyles.dates}>생성: {formatDate(item.createdAt)}</Text>
            </View>
            <View style={likePodsStyles.dateContainer}>
              <Icon name="refresh-outline" size={14} color="#FF7F50" />
              <Text style={likePodsStyles.dates}>수정: {formatDate(item.updatedAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={likePodsStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F50" />
        <Text style={likePodsStyles.loadingText}>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={likePodsStyles.errorContainer}>
        <Text style={likePodsStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={likePodsStyles.container}>
      {likedItems.length > 0 ? (
        <ScrollView contentContainerStyle={likePodsStyles.scrollViewContainer} showsVerticalScrollIndicator={false}>
          {likedItems.map((item, index) => renderItem(item, index))}
        </ScrollView>
      ) : (
        <Text style={likePodsStyles.noItemsText}>좋아요한 게시물이 없습니다.</Text>
      )}

      <ClusterBottomModal
        visible={isClusterModalVisible}
        onClose={() => setClusterModalVisible(false)}
        storeId={selectedStoreId}
      />
    </View>
  );
};

export default LikedPosts;
