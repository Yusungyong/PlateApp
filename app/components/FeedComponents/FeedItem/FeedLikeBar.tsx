import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFeedLikeHooks } from '../Hooks/feedItemHooks/useFeedLikeHooks';
import ClusterBottomModal from './ClusterBottomModal';
import LoginRequiredModal from '../../../auth/LoginRequiredModal';
import { useAuth } from '../../../auth/AuthProvider';

const FeedLikeBar = ({ feedId, initialLikeYn = 'N', initialLikeCount = 0 }) => {
  const { axiosFeedLikeCall } = useFeedLikeHooks();
  const [likeYn, setLikeYn] = useState(initialLikeYn);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false); // ✅ 로그인 모달 상태

  const { isLoggedIn, role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';

  const handleLikePress = useCallback(async () => {
    if (!isLoggedIn || isGuest) {
      setLoginModalVisible(true);
      return;
    }

    try {
      const { updatedLikeCount, updatedLikeYn } = await axiosFeedLikeCall(
        feedId,
        likeYn,
        likeCount
      );
      setLikeYn(updatedLikeYn);
      setLikeCount(updatedLikeCount);
    } catch (e) {
      console.error('좋아요 처리 실패:', e);
    }
  }, [axiosFeedLikeCall, feedId, likeYn, likeCount, isLoggedIn, isGuest]);

  return (
    <View style={styles.likeContainer}>
      <TouchableOpacity onPress={handleLikePress} style={styles.iconWrapper}>
        <Icon
          name={likeYn === 'Y' ? 'favorite' : 'favorite-border'}
          size={24}
          color="#FF7F50"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.iconText}>좋아요 {likeCount}</Text>
      </TouchableOpacity>

      <ClusterBottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        feedId={feedId}
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
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconWrapper: {
    marginRight: 5,
  },
  iconText: {
    fontSize: 14,
    color: 'black',
    padding: 5,
  },
});

export default FeedLikeBar;
