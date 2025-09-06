import React, { useState, useEffect, memo, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import FastImage from 'react-native-fast-image';
import ReplyItem from './ReplyItem';
import CommentOptionsModal from '../CommentOptionsModal';
import CommentReportReasonModal from '../CommentReportReasonModal';
import { formatDistanceToNow, formatISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { profileBucket } from '../../../../config/config';
import { useSubmitReport } from '../../FeedItem/useSubmitReport';
import { useBlockUser } from '../../FeedItem/useBlockUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  border: '#E5E7EB',
  muted: '#F3F4F6',
  primary: '#FF7F50',
  link: '#007AFF',
  highlightBg: '#FFF7E6',
  highlightBorder: '#FFD699',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16 };
const RADIUS = { sm: 6, md: 10, lg: 12 };

type Props = {
  comment: any;
  replies: any[];
  isExpanded: boolean;
  onToggleReplies: () => void;
  onReply: (info: { commentId: number; nickname: string }) => void;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onUpdateReply: (replyId: number, content: string) => void;
  onDeleteReply: (replyId: number) => void;
  onBlock?: (commentId: number) => void;
  onBlockReply?: (replyId: number) => void;
  currentUsername: string | null;
  highlight?: boolean;
  highlightReplyId?: number | null;
  scrollViewRef?: React.RefObject<any>;
};

const CommentItem: React.FC<Props> = memo(({
  comment,
  replies = [],
  isExpanded,
  onToggleReplies,
  onReply,
  onUpdate,
  onDelete,
  onUpdateReply,
  onDeleteReply,
  currentUsername,
  onBlock,
  onBlockReply,
  highlight = false,
  highlightReplyId,
  scrollViewRef,
}) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [inputText, setInputText] = useState('');
  const [hiddenByReport, setHiddenByReport] = useState<boolean>(comment.targetFlag === 'Y');

  const { submitReport } = useSubmitReport();
  const { blockUser } = useBlockUser();

  const isMine = comment.username === currentUsername;

  // highlight 애니메이션
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!highlight) return;
    const seq = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]),
      { iterations: 3 }
    );
    seq.start();
    return () => {
      seq.stop();
      anim.setValue(0);
    };
  }, [highlight, anim]);

  const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: [COLORS.bg, COLORS.highlightBg] });

  // 특정 reply 위치로 스크롤
  const replyRefs = useRef<Record<number, any>>({});
  useEffect(() => {
    if (!highlightReplyId || !isExpanded || !scrollViewRef?.current) return;
    const targetRef = replyRefs.current[highlightReplyId];
    if (!targetRef) return;

    const target = findNodeHandle(targetRef);
    const parent = findNodeHandle(scrollViewRef.current as any);
    if (!target || !parent) return;

    try {
      UIManager.measureLayout(
        target,
        parent,
        () => {},
        (_x, y) => (scrollViewRef.current as any)?.scrollToOffset?.({ offset: y, animated: true })
      );
    } catch {
      // no-op
    }
  }, [highlightReplyId, isExpanded, scrollViewRef]);

  const handleSubmitReport = useCallback(async () => {
    if (!selectedReason) return alert('신고 사유를 선택해주세요.');
    try {
      const reporterUsername = await AsyncStorage.getItem('username');
      if (!reporterUsername) return alert('로그인이 필요합니다.');
      const finalReason = selectedReason === '기타' ? inputText : selectedReason;
      await submitReport({
        reporterUsername,
        targetUsername: comment.username,
        targetType: 'feed-comment',
        targetId: comment.commentId,
        reason: finalReason,
        submittedAt: formatISO(new Date()),
      });
      setReportModalVisible(false);
      setHiddenByReport(true);
    } catch (e) {
      console.error('신고 실패:', e);
      alert('신고에 실패했습니다.');
    }
  }, [selectedReason, inputText, comment, submitReport]);

  const handleBlock = useCallback(async () => {
    try {
      const blockerUsername = await AsyncStorage.getItem('username');
      if (!blockerUsername) return alert('로그인이 필요합니다.');
      await blockUser({
        blockerUsername,
        blockedUsername: comment.username,
        blockedAt: formatISO(new Date()),
      });
      alert('사용자가 차단되었습니다.');
      onBlock?.(comment.commentId);
    } catch (e) {
      console.error('차단 실패:', e);
      alert('사용자 차단에 실패했습니다.');
    }
  }, [blockUser, comment, onBlock]);

  const modalOptions = useMemo(
    () =>
      isMine
        ? [
            { label: '댓글 수정', onPress: () => setEditing(true) },
            { label: '댓글 삭제', onPress: () => onDelete(comment.commentId), destructive: true },
          ]
        : [
            { label: '사용자 차단', onPress: handleBlock, destructive: true },
            { label: '신고하기', onPress: () => setReportModalVisible(true), destructive: true },
          ],
    [isMine, comment, onDelete, handleBlock]
  );

  const formattedTime = formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true, locale: ko });
  const isEdited = comment.updatedAt !== comment.createdAt;

  if (hiddenByReport) {
    return (
      <View style={styles.wrapper}>
        <FastImage source={{ uri: profileBucket + comment.profileImageUrl }} style={styles.avatar} />
        <View style={[styles.container, styles.containerMuted]}>
          <Text style={styles.restricted}>🔒 사용자 신고로 제재중인 댓글입니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FastImage source={{ uri: profileBucket + comment.profileImageUrl }} style={styles.avatar} />
      <Animated.View
        style={[
          styles.container,
          highlight && { backgroundColor: bgColor, borderColor: COLORS.highlightBorder, borderWidth: 1 },
        ]}
      >
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <Text style={[styles.username, isMine && { color: COLORS.primary }]}>
            {comment.username}{isMine ? ' (나)' : ''}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Icon name="ellipsis-horizontal" size={20} color={COLORS.sub} /> 
            {/* ✅ Ionicons 버전으로 교체 */}
          </TouchableOpacity>
        </View>

        {/* 본문 or 수정 입력 */}
        {editing ? (
          <TextInput
            value={editText}
            onChangeText={setEditText}
            style={styles.input}
            autoFocus
            multiline
          />
        ) : (
          <Text style={styles.content}>{comment.content}</Text>
        )}

        {/* 액션 */}
        {editing ? (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => { onUpdate(comment.commentId, editText); setEditing(false); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionPrimary}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setEditText(comment.content); setEditing(false); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.action}>취소</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footerRow}>
            <View style={styles.metaRow}>
              <Text style={styles.timeText}>{formattedTime}</Text>
              {isEdited && <Text style={styles.editedTag}>수정됨</Text>}
            </View>
            <TouchableOpacity onPress={onToggleReplies} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Text style={styles.replyToggle}>
                답글 {replies?.length ?? 0}개 {isExpanded ? '숨기기' : '보기'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onReply({ commentId: comment.commentId, nickname: comment.username })}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.replyWrite}>답글 작성</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 답글 리스트 */}
        {isExpanded && (
          <FlatList
            data={replies}
            keyExtractor={(item) => String(item.replyId)}
            renderItem={({ item }) => (
              <View
                style={styles.replyRow}
                ref={(ref) => {
                  if (ref) (replyRefs.current[item.replyId] = ref);
                }}
              >
                <ReplyItem
                  reply={item}
                  currentUsername={currentUsername}
                  onUpdate={(replyId, content) => onUpdateReply(replyId, content)}
                  onDelete={(replyId) => onDeleteReply(replyId)}
                  onBlock={(replyId) => onBlockReply?.(replyId)}
                  highlight={highlightReplyId === item.replyId}
                />
              </View>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.replyDivider} />}
            contentContainerStyle={styles.replyListContainer}
          />
        )}

        {/* 모달 */}
        <CommentOptionsModal visible={modalVisible} onClose={() => setModalVisible(false)} options={modalOptions} />
        <CommentReportReasonModal
          visible={reportModalVisible}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          inputText={inputText}
          setInputText={setInputText}
          onClose={() => setReportModalVisible(false)}
          onSubmit={handleSubmitReport}
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.lg, marginLeft: 8, marginRight: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: SPACING.sm, backgroundColor: '#D1D5DB' },
  container: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  containerMuted: { backgroundColor: COLORS.muted, borderColor: COLORS.muted },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  username: { fontWeight: '700', fontSize: 14, color: COLORS.text },
  content: { fontSize: 14, color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.xs, lineHeight: 20 },
  input: {
    backgroundColor: COLORS.bg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },

  actions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  action: { color: COLORS.sub, fontSize: 13, fontWeight: '600' },
  actionPrimary: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },

  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: SPACING.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, flex: 1 },

  timeText: { fontSize: 11, color: COLORS.sub },
  editedTag: {
    fontSize: 11, color: COLORS.sub, paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },

  replyToggle: { fontSize: 12, color: COLORS.sub },
  replyWrite: { fontSize: 13, color: COLORS.link, fontWeight: '600' },

  replyListContainer: { paddingTop: SPACING.sm, marginTop: SPACING.xs, borderTopWidth: 1, borderTopColor: COLORS.border },
  replyRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm, marginLeft: 32, paddingLeft: SPACING.md, borderLeftWidth: 2, borderLeftColor: '#F1F5F9' },
  replyDivider: { height: 8 },
  restricted: { fontSize: 13, color: COLORS.sub, paddingVertical: 6 },
});

export default CommentItem;
