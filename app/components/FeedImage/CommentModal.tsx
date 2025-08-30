import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import CommentSection from '../FeedComponents/CommentsSection/feed/CommentSection';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: number;
  highlightCommentId?: number;
  highlightReplyId?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CommentModal = ({
  visible,
  onClose,
  feedId,
  highlightCommentId,
  highlightReplyId,
}: CommentModalProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [visible]);

  if (!isMounted) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>댓글</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.commentContainer}>
          <CommentSection
            id={feedId}
            highlightCommentId={highlightCommentId}
            highlightReplyId={highlightReplyId}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 14,
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  commentContainer: {
    flexGrow: 1,
    minHeight: 450,
  },
});

export default CommentModal;
