import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useLikeHooks } from '../../../../videoComponents/videoComponetHooks/likeHooks';
import ClusterBottomModal from '../../../FeedItem/ClusterBottomModal';

const LikeButton = ({ storeId, initialLikeYn, initialLikeCount }) => {
  const { axiosLikeCall } = useLikeHooks();
  const [likeYn, setLikeYn] = useState(initialLikeYn || 'N');
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLikePress = useCallback(async () => {
    const { updatedLikeConut, updatedLikeYn } = await axiosLikeCall(
      storeId,
      likeYn,
      likeCount
    );
    setLikeYn(updatedLikeYn);
    setLikeCount(updatedLikeConut);
  }, [axiosLikeCall, storeId, likeYn, likeCount]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
        <Icon
          name={likeYn === 'Y' ? 'heart' : 'heart-outline'} // ✅ Ionicons 하트로 교체
          size={24}
          color="#FF7F50"
        />
        <Text style={styles.likeCountText}>{likeCount}</Text>
      </TouchableOpacity>

      <ClusterBottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        storeId={storeId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCountText: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 6,
  },
});

export default LikeButton;
