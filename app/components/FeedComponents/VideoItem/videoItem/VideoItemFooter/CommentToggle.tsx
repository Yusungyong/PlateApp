import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentSection from '../../../CommentsSection/video/CommentSection';

const CommentToggle = ({ storeId, commentCount }) => {
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    if (!visible) {
      setVisible(true);
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
      }).start(() => {
        setVisible(false);
      });
    }
  }, [visible, anim]);

  return (
    <View style={styles.wrapper}>
      {/* 댓글 아이콘 + 숫자 버튼 (LikeButton과 가로 정렬) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={toggle} style={styles.toggleButton}>
          <Icon name="comment" size={24} color="#FF7F50" />
          <Text style={styles.iconText}>{commentCount || 0}</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 영역 (버튼 아래 블록처럼 표시) */}
      {visible && (
        <Animated.View style={[styles.commentContainer, { opacity: anim }]}>
          <CommentSection id={storeId} type="video" />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    marginLeft: 12, // LikeButton과 간격
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconText: {
    fontSize: 14,
    color: 'black',
    paddingLeft: 6,
  },
  commentContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});

export default CommentToggle;
