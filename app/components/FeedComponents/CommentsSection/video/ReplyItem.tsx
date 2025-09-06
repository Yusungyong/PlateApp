import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { formatDistanceToNow, formatISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { profileBucket } from '../../../../config/config';
import CommentOptionsModal from '../CommentOptionsModal';
import CommentReportReasonModal from '../CommentReportReasonModal';
import { useSubmitReport } from '../../FeedItem/useSubmitReport';
import { useBlockUser } from '../../FeedItem/useBlockUser';

const ReplyItem = forwardRef(({
  reply,
  currentUsername,
  onUpdate,
  onDelete,
  onBlock,
  highlight = false,
}, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [inputText, setInputText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  const { submitReport } = useSubmitReport();
  const { blockUser } = useBlockUser();

  const isMine = reply.username === currentUsername;
  const formattedTime = formatDistanceToNow(new Date(reply.updatedAt), {
    addSuffix: true,
    locale: ko,
  });
  const isEdited = reply.updatedAt !== reply.createdAt;

  useEffect(() => {
    if (highlight) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [highlight]);

  const handleEditSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onUpdate(reply.replyId, trimmed);
    setEditing(false);
  };

  const handleBlock = async () => {
    try {
      const blockerUsername = await AsyncStorage.getItem('username');
      if (!blockerUsername) {
        alert('로그인이 필요합니다.');
        return;
      }

      await blockUser({
        blockerUsername,
        blockedUsername: reply.username,
        blockedAt: formatISO(new Date()),
      });

      alert('사용자가 차단되었습니다.');
      onBlock?.(reply.replyId);
    } catch (e) {
      console.error('차단 실패:', e);
      alert('사용자 차단에 실패했습니다.');
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    try {
      const reporterUsername = await AsyncStorage.getItem('username');
      if (!reporterUsername) {
        alert('로그인이 필요합니다.');
        return;
      }

      const finalReason = selectedReason === '기타' ? inputText : selectedReason;

      await submitReport({
        reporterUsername,
        targetUsername: reply.username,
        targetType: 'video-reply',
        targetId: reply.replyId,
        reason: finalReason,
        submittedAt: formatISO(new Date()),
      });

      alert('신고가 접수되었습니다.');
      reply.targetFlag = 'Y';
      setReportModalVisible(false);
    } catch (e) {
      console.error('신고 실패:', e);
      alert('신고에 실패했습니다.');
    }
  };

  const modalOptions = isMine
    ? [
        { label: '댓글 수정', onPress: () => setEditing(true) },
        { label: '댓글 삭제', onPress: () => onDelete(reply.replyId), destructive: true },
      ]
    : [
        { label: '사용자 차단', onPress: handleBlock, destructive: true },
        { label: '신고하기', onPress: () => setReportModalVisible(true), destructive: true },
      ];

  if (reply.targetFlag === 'Y') {
    return (
      <View ref={ref} style={styles.wrapper}>
        <FastImage
          source={{ uri: profileBucket + reply.profileImageUrl }}
          style={styles.avatar}
        />
        <View style={styles.container}>
          <Text style={styles.restricted}>🔒 사용자 신고로 제재중인 댓글입니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View ref={ref} style={[styles.wrapper, { opacity: fadeAnim }]}>
      <FastImage
        source={{ uri: profileBucket + reply.profileImageUrl }}
        style={styles.avatar}
      />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{reply.username}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="ellipsis-horizontal" size={20} color="#888" /> 
            {/* ✅ Ionicons 가로 점 3개 */}
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.input}
              autoFocus
              multiline
            />
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleEditSave}>
                <Text style={styles.action}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setEditText(reply.content);
                setEditing(false);
              }}>
                <Text style={styles.action}>취소</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.content}>{reply.content}</Text>
            <Text style={styles.time}>
              {formattedTime}
              {isEdited && <Text style={styles.editedTag}> (수정됨)</Text>}
            </Text>
          </>
        )}
      </View>

      <CommentOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={modalOptions}
      />

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
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginLeft: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  action: {
    marginRight: 16,
    color: '#007aff',
    fontSize: 13,
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  editedTag: {
    fontSize: 11,
    color: '#aaa',
  },
  restricted: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export default ReplyItem;
