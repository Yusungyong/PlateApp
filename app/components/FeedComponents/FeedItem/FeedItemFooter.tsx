import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeedLikeBar from './FeedLikeBar';
import CommentSection from '../CommentsSection/feed/CommentSection';

const FeedItemFooter = ({ feedData }) => {
  const [commentVisible, setCommentVisible] = useState(false);

  const toggleComment = useCallback(() => {
    setCommentVisible(prev => !prev);
  }, []);

  return (
    <>
      <View style={styles.footerContainer}>
        <View style={styles.actionRow}>
          <FeedLikeBar
            feedId={feedData.id}
            initialLikeYn={feedData.likeYn}
            initialLikeCount={feedData.likeCount}
          />
          <TouchableOpacity onPress={toggleComment} style={styles.commentContainer}>
            <Icon name="comment" size={24} color="#FF7F50" />
            <Text style={styles.iconText}>댓글 {feedData.commentCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {commentVisible && (
        <View style={{ flex: 1 }}>
          <CommentSection id={feedData.id} type="feed" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  iconText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default FeedItemFooter;
