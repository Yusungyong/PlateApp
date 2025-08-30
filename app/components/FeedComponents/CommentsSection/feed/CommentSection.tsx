import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

import { useAddFeedComment } from '../../../../common/commentHooks/useAddFeedComment';
import { useAddFeedReply } from '../../../../common/commentHooks/useAddFeedReply';
import { useUpdateFeedComment } from '../../../../common/commentHooks/useUpdateFeedComment';
import { useUpdateFeedReply } from '../../../../common/commentHooks/useUpdateFeedReply';
import { useDeleteFeedComment } from '../../../../common/commentHooks/useDeleteFeedComment';
import { useDeleteFeedReply } from '../../../../common/commentHooks/useDeleteFeedReply';
import { useGetFeedComments } from '../../../../common/commentHooks/useGetFeedComments';
import { useGetFeedReplies } from '../../../../common/commentHooks/useGetFeedReplies';

const COLORS = { border: '#E5E7EB' };

interface CommentSectionProps {
  id: number;
  highlightCommentId?: number;
  highlightReplyId?: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  id,
  highlightCommentId,
  highlightReplyId,
}) => {
  const flatListRef = useRef<FlatList>(null);

  const { getComments } = useGetFeedComments();
  const { getReplies } = useGetFeedReplies();
  const { addComment } = useAddFeedComment();
  const { addReply } = useAddFeedReply();
  const { updateFeedComment } = useUpdateFeedComment();
  const { deleteFeedComment } = useDeleteFeedComment();
  const { updateFeedReply } = useUpdateFeedReply();
  const { deleteFeedReply } = useDeleteFeedReply();

  const [comments, setComments] = useState<any[]>([]);
  const [replyMap, setReplyMap] = useState<Record<number, any[]>>({});
  const [expandedCommentIds, setExpandedCommentIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: number; nickname: string } | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [highlightedComment, setHighlightedComment] = useState<number | null>(null);
  const [highlightedReply, setHighlightedReply] = useState<number | null>(null);

  // username 로드
  const fetchCurrentUsername = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setCurrentUsername(username);
    } catch (e) {
      console.error('username 가져오기 실패', e);
    }
  }, []);

  // 댓글 로드
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getComments(id);
      setComments(res);
    } catch (e) {
      console.error('댓글 불러오기 실패', e);
    } finally {
      setIsLoading(false);
    }
  }, [getComments, id]);

  useEffect(() => {
    fetchCurrentUsername();
    fetchComments();
  }, [id, fetchComments, fetchCurrentUsername]);

  // 댓글 하이라이트 + 스크롤
  useEffect(() => {
    if (!highlightCommentId || comments.length === 0) return;
    const index = comments.findIndex((c) => c.commentId === highlightCommentId);
    if (index < 0) return;

    flatListRef.current?.scrollToIndex({ index, animated: true });
    setHighlightedComment(highlightCommentId);

    const t = setTimeout(() => setHighlightedComment(null), 2000);
    return () => clearTimeout(t);
  }, [highlightCommentId, comments]);

  // 대댓글 하이라이트(펼침 + 표시 타이머)
  useEffect(() => {
    if (!highlightReplyId || !highlightCommentId || comments.length === 0) return;
    const exists = comments.some((c) => c.commentId === highlightCommentId);
    if (!exists) return;

    const ensureExpanded = async () => {
      const already = expandedCommentIds.includes(highlightCommentId);
      if (!already) await toggleReplies(highlightCommentId);
      const t1 = setTimeout(() => setHighlightedReply(highlightReplyId), 300);
      const t2 = setTimeout(() => setHighlightedReply(null), 2300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    const cleanup = ensureExpanded();
    return () => {
      if (typeof (cleanup as any) === 'function') (cleanup as any)();
    };
  }, [highlightReplyId, highlightCommentId, comments, expandedCommentIds]);

  // 답글 토글 & 캐시 유지
  const toggleReplies = useCallback(
    async (commentId: number) => {
      const isExpanded = expandedCommentIds.includes(commentId);
      if (isExpanded) {
        setExpandedCommentIds((prev) => prev.filter((id) => id !== commentId));
        return;
      }
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
    },
    [expandedCommentIds, replyMap, getReplies]
  );

  // 등록
  const handleSubmit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      try {
        const username = await AsyncStorage.getItem('username');
        if (!username) return;

        if (replyTo) {
          await addReply({ username, commentId: replyTo.commentId, content: trimmed, feedId: id });
          // 캐시되어 펼쳐진 경우 즉시 반영
          const replies = await getReplies(replyTo.commentId);
          setReplyMap((prev) => ({ ...prev, [replyTo.commentId]: replies }));
        } else {
          await addComment({ username, content: trimmed, feedId: id });
        }

        setReplyTo(null);
        await fetchComments();
      } catch (e) {
        console.error('댓글 작성 실패:', e);
      }
    },
    [replyTo, id, addReply, addComment, fetchComments, getReplies]
  );

  // 수정/삭제(댓글)
  const handleUpdate = useCallback(
    async (commentId: number, content: string) => {
      await updateFeedComment(commentId, content);
      await fetchComments();
    },
    [updateFeedComment, fetchComments]
  );

  const handleDelete = useCallback(
    async (commentId: number) => {
      await deleteFeedComment(commentId);
      await fetchComments();
    },
    [deleteFeedComment, fetchComments]
  );

  // 수정/삭제(대댓글)
  const handleUpdateReply = useCallback(
    async (replyId: number, content: string, parentId: number) => {
      await updateFeedReply(replyId, content);
      const replies = await getReplies(parentId);
      setReplyMap((prev) => ({ ...prev, [parentId]: replies }));
      await fetchComments(); // 상위 카운트 동기화
    },
    [updateFeedReply, getReplies, fetchComments]
  );

  const handleDeleteReply = useCallback(
    async (replyId: number, parentId: number) => {
      await deleteFeedReply(replyId);
      const replies = await getReplies(parentId);
      setReplyMap((prev) => ({ ...prev, [parentId]: replies }));
      await fetchComments(); // 상위 카운트 동기화
    },
    [deleteFeedReply, getReplies, fetchComments]
  );

  // 차단
  const handleBlockComment = useCallback((commentId: number) => {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  }, []);

  const handleBlockReply = useCallback((replyId: number, parentId: number) => {
    setReplyMap((prev) => {
      const updated = (prev[parentId] || []).filter((r) => r.replyId !== replyId);
      return { ...prev, [parentId]: updated };
    });
  }, []);

  const keyExtractor = useCallback((item: any) => String(item.commentId), []);
  const contentContainerStyle = useMemo(() => ({ paddingBottom: 20, paddingHorizontal: 16 }), []);

  const onScrollToIndexFailed = useCallback((info: any) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 250);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#888" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          onScrollToIndexFailed={onScrollToIndexFailed}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              replies={replyMap[item.commentId] ?? []}
              isExpanded={expandedCommentIds.includes(item.commentId)}
              onToggleReplies={() => toggleReplies(item.commentId)}
              onReply={setReplyTo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onBlock={handleBlockComment}
              onBlockReply={(replyId) => handleBlockReply(replyId, item.commentId)}
              onUpdateReply={(replyId, content) => handleUpdateReply(replyId, content, item.commentId)}
              onDeleteReply={(replyId) => handleDeleteReply(replyId, item.commentId)}
              currentUsername={currentUsername}
              highlight={highlightedComment === item.commentId}
              highlightReplyId={highlightedReply}
              scrollViewRef={flatListRef}  // 부모 스크롤 기준 전달 (실패해도 안전)
            />
          )}
          contentContainerStyle={contentContainerStyle}
          ItemSeparatorComponent={() => (
            <View style={{ height: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border }} />
          )}
        />
      )}

      <CommentInput
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, marginTop: 10 } });

export default CommentSection;
