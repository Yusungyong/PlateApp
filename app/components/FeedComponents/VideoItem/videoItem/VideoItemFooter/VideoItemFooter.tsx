import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useLikeHooks } from '../../../../videoComponents/videoComponetHooks/likeHooks';
import ClusterBottomModal from '../../../FeedItem/ClusterBottomModal';
import CommentSection from '../../../CommentsSection/video/CommentSection';
import LoginRequiredModal from '../../../../../auth/LoginRequiredModal';
import { useAuth } from '../../../../../auth/AuthProvider';

const VideoItemFooter = ({ videoData }) => {
  const { axiosLikeCall } = useLikeHooks();
  const [likeYn, setLikeYn] = useState(videoData.likeYn || 'N');
  const [likeCount, setLikeCount] = useState(videoData.likeCount || 0);
  const [commentVisible, setCommentVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false); // ✅ 추가
  const anim = useRef(new Animated.Value(0)).current;

  const { isLoggedIn, role } = useAuth(); // ✅ 로그인 정보
  const isGuest = role === 'ROLE_GUEST';

  const handleLikePress = useCallback(async () => {
    if (!isLoggedIn || isGuest) {
      setLoginModalVisible(true);
      return;
    }

    try {
      const { updatedLikeConut, updatedLikeYn } = await axiosLikeCall(
        videoData.storeId,
        likeYn,
        likeCount
      );
      setLikeYn(updatedLikeYn);
      setLikeCount(updatedLikeConut);
    } catch (e) {
      console.error('비디오 좋아요 처리 실패:', e);
    }
  }, [axiosLikeCall, videoData.storeId, likeYn, likeCount, isLoggedIn, isGuest]);

  const toggleComment = useCallback(() => {
    if (!commentVisible) {
      setCommentVisible(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setCommentVisible(false));
    }
  }, [commentVisible, anim]);

  return (
    <View style={styles.footerContainer}>
      {/* 버튼 행 */}
      <View style={styles.actionRow}>
        {/* 좋아요 아이콘 */}
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={handleLikePress} style={styles.iconOnly}>
            <Icon
              name={likeYn === 'Y' ? 'heart' : 'heart-outline'} // ✅ Ionicons 하트
              size={24}
              color="#FF7F50"
            />
          </TouchableOpacity>

          {/* 좋아요 텍스트 - 모달 호출 */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.iconText}> 좋아요 {likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* 댓글 토글 */}
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={toggleComment} style={styles.iconButton}>
            <Icon name="chatbubble-outline" size={24} color="#FF7F50" /> 
            {/* ✅ Ionicons 댓글 */}
            <Text style={styles.iconText}> 댓글 {videoData.commentCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 댓글 섹션 */}
      {commentVisible && (
        <Animated.View style={[styles.commentContainer, { opacity: anim }]}>
          <CommentSection id={videoData.storeId} type="video" />
        </Animated.View>
      )}

      {/* 좋아요한 사용자 모달 */}
      <ClusterBottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        storeId={videoData.storeId}
      />

      {/* ✅ 로그인 유도 모달 */}
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconOnly: {
    padding: 4,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 6,
  },
  commentContainer: {
    marginTop: 10,
    borderRadius: 8,
  },
});

export default VideoItemFooter;
