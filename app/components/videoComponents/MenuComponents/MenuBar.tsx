import React, { memo, useCallback, useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ClusterBottomModal from '../../FeedComponents/FeedItem/ClusterBottomModal';
import { useLikeHooks } from '../videoComponetHooks/likeHooks';
import { styles as baseStyles } from '../styles';
import { renderButton } from './RenderButton';
import { useAuth } from '../../../auth/AuthProvider';
import LoginRequiredModal from '../../../auth/LoginRequiredModal';

const MenuBar = ({ item, navigation, onCommentPress }) => {
  
  const { 
    storeId, 
    likeCount: initialLikeCount, 
    likeYn: initialLikeYn, 
    latitude, 
    longitude, 
    title, 
    address, 
    commentCount,
    placeId,
  } = item;
  
  const { axiosLikeCall } = useLikeHooks();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeYn, setLikeYn] = useState(initialLikeYn);
  const [isLikeClusterModalVisible, setLikeClusterModalVisible] = useState(false);
  const {role, isLoggedIn} = useAuth();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  console.log('MenuBar item:', item);
  const handleLikePress = useCallback(async () => {
    if(role === 'ROLE_GUEST'){
      setLoginModalVisible(true);
      return false;
    }
    try {
      const { updatedLikeConut, updatedLikeYn } = await axiosLikeCall(storeId, likeYn, likeCount);
      setLikeCount(updatedLikeConut);
      setLikeYn(updatedLikeYn);
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  }, [axiosLikeCall, storeId, likeYn, likeCount]);

  // 좋아요 숫자 터치 핸들러 (클러스터 모달 표시)
  const handleLikeCountPress = useCallback(() => {
    setLikeClusterModalVisible(true);
  }, []);

  // 댓글 버튼 핸들러
  const handleCommentPress = useCallback(() => {
    onCommentPress(item);
  }, [item, onCommentPress]);

  // 위치 버튼 핸들러
  const handleLocationPress = useCallback(() => {
    navigation.navigate('지도', {
      initialLatitude: latitude,
      initialLongitude: longitude,
      initialLatitudeDelta: 0.007,
      initialLongitudeDelta: 0.007,
    });
  }, [navigation, latitude, longitude]);

  // 메뉴 버튼 핸들러
  const handleMenuPress = useCallback(() => {
    navigation.navigate('Menu', { storeName: item.storeName, placeId: item.placeId });
  }, [navigation, storeId]);

  // 정보 버튼 핸들러
  const handleInfoPress = useCallback(() => {
    Alert.alert('Information', `Title: ${title}\nAddress: ${address}`);
  }, [title, address]);

  // 필터 버튼 핸들러: VideoFilterSettings 화면으로 이동
  const handleFilterPress = useCallback(() => {
    navigation.navigate('VideoFilterSettings');
  }, [navigation]);
  
  return (
    <>
      <View style={baseStyles.buttonGroup}>
        {/* 좋아요 버튼: 아이콘과 숫자 영역 분리 */}
        <View style={baseStyles.likeContainer}>
          <TouchableOpacity onPress={handleLikePress}>
            <Icon
              name={likeYn === 'Y' ? "heart" : "heart-outline"}
              size={36}
              color={likeYn === 'Y' ? "red" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={baseStyles.likeCountTouchable} onPress={handleLikeCountPress}>
            <Text style={baseStyles.likeCountText}>{likeCount}</Text>
          </TouchableOpacity>
        </View>
        {renderButton({
          iconName: "chatbubble-outline",
          count: commentCount,
          onPress: handleCommentPress
        })}
        {renderButton({ iconName: "location-outline", text: "위치", onPress: handleLocationPress })}
        {renderButton({ iconName: "menu-outline", text: "메뉴", onPress: handleMenuPress })}
        {renderButton({ iconName: "information-circle-outline", text: "정보", onPress: handleInfoPress })}
        {renderButton({ iconName: "funnel-outline", text: "필터", onPress: handleFilterPress })}
      </View>

      <ClusterBottomModal
        visible={isLikeClusterModalVisible}
        onClose={() => setLikeClusterModalVisible(false)}
        storeId={storeId}
      />

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
};

export default memo(MenuBar);
