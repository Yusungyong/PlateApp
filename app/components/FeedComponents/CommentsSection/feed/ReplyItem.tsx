import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDistanceToNow, formatISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentOptionsModal from '../CommentOptionsModal';
import CommentReportReasonModal from '../CommentReportReasonModal';
import { useSubmitReport } from '../../FeedItem/useSubmitReport';
import { useBlockUser } from '../../FeedItem/useBlockUser';
import { profileBucket } from '../../../../config/config';

const COLORS = {
  bg: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  border: '#E5E7EB',
  chip: '#F5F5F5',
  link: '#007AFF',
  primary: '#FF7F50',
  highlightBg: '#FFF7E6',
};

const RADIUS = { sm: 6, md: 10, lg: 12 };

type Props = {
  reply: any;
  currentUsername: string | null;
  onUpdate: (replyId: number, content: string) => void;
  onDelete: (replyId: number) => void;
  onBlock?: (replyId: number) => void;
  highlight?: boolean;
};

const ReplyItem: React.FC<Props> = memo(({ reply, currentUsername, onUpdate, onDelete, onBlock, highlight = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [inputText, setInputText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [hiddenByReport, setHiddenByReport] = useState<boolean>(reply.targetFlag === 'Y');

  const { submitReport } = useSubmitReport();
  const { blockUser } = useBlockUser();

  const isMine = reply.username === currentUsername;
  const formattedTime = formatDistanceToNow(new Date(reply.updatedAt), { addSuffix: true, locale: ko });
  const isEdited = reply.updatedAt !== reply.createdAt;

  // highlight animation (정지/클린업)
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

  const handleEditSave = useCallback(() => {
    if (!editText.trim()) return;
    onUpdate(reply.replyId, editText);
    setEditing(false);
  }, [editText, onUpdate, reply]);

  const handleEditCancel = useCallback(() => {
    setEditing(false);
    setEditText(reply.content);
  }, [reply]);

  const handleDelete = useCallback(() => onDelete(reply.replyId), [onDelete, reply]);

  const handleBlock = useCallback(async () => {
    try {
      const blockerUsername = await AsyncStorage.getItem('username');
      if (!blockerUsername) return alert('로그인이 필요합니다.');
      await blockUser({
        blockerUsername,
        blockedUsername: reply.username,
        blockedAt: formatISO(new Date()),
      });
      alert('사용자가 차단되었습니다.');
      onBlock?.(reply.replyId);
    } catch (e) {
      console.error('사용자 차단 실패:', e);
      alert('차단에 실패했습니다.');
    }
  }, [blockUser, onBlock, reply]);

  const handleSubmitReport = useCallback(async () => {
    if (!selectedReason) return alert('신고 사유를 선택해주세요.');
    try {
      const reporterUsername = await AsyncStorage.getItem('username');
      if (!reporterUsername) return alert('로그인이 필요합니다.');
      const reason = selectedReason === '기타' ? inputText : selectedReason;
      await submitReport({
        reporterUsername,
        targetUsername: reply.username,
        targetType: 'feed-reply',
        targetId: reply.replyId,
        reason,
        submittedAt: formatISO(new Date()),
      });
      setReportModalVisible(false);
      setHiddenByReport(true); // ✅ prop mutate 대신 로컬 상태
    } catch (e) {
      console.error('신고 실패:', e);
      alert('신고에 실패했습니다.');
    }
  }, [selectedReason, inputText, reply, submitReport]);

  const modalOptions = isMine
    ? [
        { label: '댓글 수정', onPress: () => setEditing(true) },
        { label: '댓글 삭제', onPress: handleDelete, destructive: true },
      ]
    : [
        { label: '사용자 차단', onPress: handleBlock, destructive: true },
        { label: '신고하기', onPress: () => setReportModalVisible(true), destructive: true },
      ];

  if (hiddenByReport) {
    return (
      <View style={styles.wrapper}>
        <FastImage source={{ uri: profileBucket + reply.profileImageUrl }} style={styles.avatar} />
        <View style={[styles.container, styles.containerMuted]}>
          <Text style={styles.restricted}>🔒 사용자 신고로 제재중인 댓글입니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FastImage source={{ uri: profileBucket + reply.profileImageUrl }} style={styles.avatar} />
      <Animated.View style={[styles.container, highlight && { backgroundColor: bgColor }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.username, isMine && { color: COLORS.primary }]}>
            {reply.username}{isMine ? ' (나)' : ''}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Icon name="more-horiz" size={20} color={COLORS.sub} />
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <TextInput style={styles.input} value={editText} onChangeText={setEditText} autoFocus multiline />
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleEditSave} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Text style={styles.actionPrimary}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditCancel} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Text style={styles.action}>취소</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.content}>{reply.content}</Text>
            <Text style={styles.time}>
              {formattedTime}{isEdited && <Text style={styles.editedTag}>  ·  수정됨</Text>}
            </Text>
          </>
        )}

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
  wrapper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, marginLeft: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#ccc', marginRight: 10 },
  container: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, padding: 10, borderWidth: 1, borderColor: COLORS.border },
  containerMuted: { backgroundColor: COLORS.chip, borderColor: COLORS.border },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  username: { fontWeight: '700', fontSize: 13, color: COLORS.text },

  content: { fontSize: 14, color: COLORS.text, marginTop: 6, marginBottom: 4, lineHeight: 20 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 8, fontSize: 13, marginTop: 6, marginBottom: 4 },

  actions: { flexDirection: 'row', marginBottom: 6, gap: 16 },
  action: { color: COLORS.sub, fontSize: 13, fontWeight: '600' },
  actionPrimary: { color: COLORS.link, fontSize: 13, fontWeight: '700' },

  time: { fontSize: 11, color: COLORS.sub, marginTop: 2 },
  editedTag: { fontSize: 11, color: COLORS.sub },

  restricted: { fontSize: 13, color: COLORS.sub, paddingVertical: 6 },
});

export default ReplyItem;
