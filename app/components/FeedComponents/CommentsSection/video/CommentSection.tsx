import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { useGetVideoReplies } from '../../../../common/commentHooks/useGetVideoReplies';
import { useAddVideoComment } from '../../../../common/commentHooks/useAddVideoComment';
import { useAddVideoReply } from '../../../../common/commentHooks/useAddVideoReply';
import { useUpdateVideoComment } from '../../../../common/commentHooks/useUpdateVideoComment';
import { useUpdateVideoReply } from '../../../../common/commentHooks/useUpdateVideoReply';
import { useDeleteVideoComment } from '../../../../common/commentHooks/useDeleteVideoComment';
import { useDeleteVideoReply } from '../../../../common/commentHooks/useDeleteVideoReply';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetVideoComments } from '../../../../common/commentHooks/useGetVideoComments';

interface CommentSectionProps {
  id: number;
  scrollToCommentId?: number;
  scrollToReplyId?: number;
}

const CommentSection = ({ id, scrollToCommentId, scrollToReplyId }: CommentSectionProps) => {
  const { getComments } = useGetVideoComments();
  const { getReplies } = useGetVideoReplies();
  const { addComment } = useAddVideoComment();
  const { addReply } = useAddVideoReply();
  const { updateVideoComment } = useUpdateVideoComment();
  const { updateVideoReply } = useUpdateVideoReply();
  const { deleteComment } = useDeleteVideoComment();
  const { deleteReply } = useDeleteVideoReply();
  
  const [comments, setComments] = useState([]);
  const [replyMap, setReplyMap] = useState<Record<number, any[]>>({});
  const [expandedCommentIds, setExpandedCommentIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: number; nickname: string } | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [highlightCommentId, setHighlightCommentId] = useState<number | null>(null);
  const [highlightReplyId, setHighlightReplyId] = useState<number | null>(null);

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const replyRefs = useRef<Record<number, any>>({});

  useEffect(() => {
    fetchCurrentUsername();
    fetchComments();
  }, [id]);

  const fetchCurrentUsername = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setCurrentUsername(username);
    } catch (e) {
      console.error('username 가져오기 실패', e);
    }
  };

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await getComments(id);
      setComments(res);
    } catch (e) {
      console.error('댓글 불러오기 실패', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReplies = async (commentId: number) => {
    const isExpanded = expandedCommentIds.includes(commentId);
    if (isExpanded) {
      setExpandedCommentIds((prev) => prev.filter((id) => id !== commentId));
    } else {
      if (!replyMap[commentId]) {
        try {
          const replies = await getReplies(commentId);
          setReplyMap((prev) => ({ ...prev, [commentId]: replies }));
        } catch (e) {
          console.error('대댓글 불러오기 실패:', e);
          return;
        }
      }
      setExpandedCommentIds((prev) => [...prev, commentId]);
    }
  };

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) return;

      if (replyTo) {
        await addReply({ username, commentId: replyTo.commentId, content: trimmed, storeId: id });
      } else {
        await addComment({ username, content: trimmed, storeId: id });
      }

      setReplyTo(null);
      await fetchComments();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (e) {
      console.error('댓글 작성 실패:', e);
    }
  };

  const handleUpdate = async (commentId: number, content: string) => {
    await updateVideoComment(commentId, content);
    await fetchComments();
  };

  const handleDelete = async (commentId: number) => {
    await deleteComment(commentId);
    await fetchComments();
  };

  const handleUpdateReply = async (replyId: number, content: string, parentId: number) => {
    await updateVideoReply(replyId, content);
    const replies = await getReplies(parentId);
    setReplyMap((prev) => ({ ...prev, [parentId]: replies }));
  };

  const handleDeleteReply = async (replyId: number, parentId: number) => {
    await deleteReply(replyId);
    const replies = await getReplies(parentId);
    setReplyMap((prev) => ({ ...prev, [parentId]: replies }));
  };

  const handleBlockComment = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  const handleBlockReply = (replyId: number, parentId: number) => {
    setReplyMap((prev) => {
      const updatedReplies = (prev[parentId] || []).filter(r => r.replyId !== replyId);
      return { ...prev, [parentId]: updatedReplies };
    });
  };

  useEffect(() => {
    if (scrollToCommentId && comments.length > 0) {
      const index = comments.findIndex((c) => c.commentId === scrollToCommentId);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setHighlightCommentId(scrollToCommentId);
        setTimeout(() => setHighlightCommentId(null), 2000);
      }
    }
  }, [scrollToCommentId, comments]);

  useEffect(() => {
    if (scrollToReplyId && comments.length > 0) {
      const parent = comments.find((c) =>
        replyMap[c.commentId]?.some((r) => r.replyId === scrollToReplyId)
      );
      if (parent) {
        const index = comments.findIndex((c) => c.commentId === parent.commentId);
        if (index !== -1) {
          if (!expandedCommentIds.includes(parent.commentId)) {
            setExpandedCommentIds((prev) => [...prev, parent.commentId]);
          }

          flatListRef.current?.scrollToIndex({ index, animated: true });

          setTimeout(() => {
            const replyRef = replyRefs.current[scrollToReplyId];
            if (replyRef && replyRef.measure) {
              replyRef.measure((x, y, w, h, pageX, pageY) => {
                flatListRef.current?.getScrollResponder().scrollResponderScrollTo({
                  y: pageY - 150,
                  animated: true,
                });
                setHighlightReplyId(scrollToReplyId);
                setTimeout(() => setHighlightReplyId(null), 2000);
              });
            }
          }, 700);
        }
      }
    }
  }, [scrollToReplyId, comments, replyMap, expandedCommentIds]);

  const renderEmptyComponent = () => (
    <Text style={styles.emptyText}>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</Text>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#888" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item.commentId.toString()}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              highlight={highlightCommentId === item.commentId}
              replies={replyMap[item.commentId] ?? []}
              isExpanded={expandedCommentIds.includes(item.commentId)}
              highlightReplyId={highlightReplyId}
              onToggleReplies={() => toggleReplies(item.commentId)}
              onReply={(info) => setReplyTo(info)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onBlock={(commentId) => handleBlockComment(commentId)}
              onBlockReply={(replyId) => handleBlockReply(replyId, item.commentId)}
              onUpdateReply={(replyId, content) => handleUpdateReply(replyId, content, item.commentId)}
              onDeleteReply={(replyId) => handleDeleteReply(replyId, item.commentId)}
              currentUsername={currentUsername}
              replyRefs={replyRefs.current} // ✅ 전달
            />
          )}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          style={{ flex: 1 }}
        />
      )}

      <CommentInput
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 13,
  },
});

export default CommentSection;
