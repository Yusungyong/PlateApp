import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import ReplyComponent from './ReplyComponent';
import { profileBucket } from '../../../config/config';
import VideoMoreOptionsModal from '../../FeedComponents/VideoItem/videoItem/VideoMoreOptionsModal';
import ReportReasonModal from '../../FeedComponents/FeedItem/ReportReasonModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubmitReport } from '../../FeedComponents/FeedItem/useSubmitReport';
import LoginRequiredModal from '../../../auth/LoginRequiredModal';
import { useAuth } from '../../../auth/AuthProvider';

interface CommentItemProps {
  commentId: string;
  username: string;
  commentText: string;
  updatedAt: string;
  profileImageUrl: string;
  commentCount?: number;
  storeId: number;
  fetchComments: () => void;
  onAddReply: (commentId: string, replyText: string) => Promise<void>;
  targetFlag?: string;
}

const formatUpdateTime = (updatedAt: string) => {
  const date = new Date(updatedAt);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
};

const CommentItem: React.FC<CommentItemProps> = memo(({
  commentId,
  username,
  commentText,
  updatedAt,
  profileImageUrl,
  commentCount = 0,
  onAddReply,
  fetchComments,
  storeId,
  targetFlag,
}) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isReported, setIsReported] = useState(targetFlag === 'Y');
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const { isLoggedIn, role } = useAuth();
  const { submitReport } = useSubmitReport();

  const toggleReplyVisibility = () => setIsReplyVisible(prev => !prev);
  const handleReplyClick = () => setIsReplying(true);

  const handleAddReply = async () => {

    if (!isLoggedIn || role === 'ROLE_GUEST') {
      setLoginModalVisible(true);
      return;
    }


    if (!replyText.trim()) return;
    try {
      await onAddReply(commentId, replyText.trim());
      setReplyText('');
      setIsReplying(false);
      Alert.alert('성공', '답글이 등록되었습니다!');
      fetchComments();
    } catch (error: any) {
      Alert.alert('오류 발생', error.message);
    }
  };

  const handleReport = () => {
    setOptionsVisible(false);
    setTimeout(() => setReportModalVisible(true), 250); // 기존 모달이 닫힌 뒤 열림
  };

  const handleReportSubmit = async (reason: string) => {
    setReportModalVisible(false);
    try {
      const reporterUsername = await AsyncStorage.getItem('username');
      if (!reporterUsername) throw new Error('로그인 정보가 없습니다.');

      await submitReport({
        reporterUsername,
        targetType: 'video-comment',
        targetUsername: username,
        targetId: parseInt(commentId),
        reason,
        submittedAt: new Date().toISOString(),
      });

      setIsReported(true);
    } catch (err) {
      Alert.alert('신고 실패', '신고 도중 오류가 발생했습니다.');
    }
  };

  const handleBlock = () => {
    setOptionsVisible(false);
    Alert.alert('사용자 차단', '이 사용자를 차단했습니다.');
  };

  return (
    <View style={styles.comment}>
      <View style={styles.userIcon}>
        {profileImageUrl ? (
          <FastImage
            source={{ uri: `${profileBucket}${profileImageUrl}` }}
            style={styles.profileImage}
          />
        ) : (
          <Icon name="account-circle" size={40} color="#888" />
        )}
      </View>

      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{username}</Text>

          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(true);
            }}
            style={styles.menuIcon}
          >
            <Icon name="dots-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.commentText}>
          {isReported ? '사용자 신고로 제재중인 댓글입니다.' : commentText}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleReplyClick}>
            <Text style={styles.replyAction}>답글 달기</Text>
          </TouchableOpacity>

          {commentCount > 0 && (
            <TouchableOpacity onPress={toggleReplyVisibility}>
              <Text style={styles.replyText}>
                {isReplyVisible ? '답글 숨기기' : `${commentCount}개의 답글 보기`}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.commentDate}>{formatUpdateTime(updatedAt)}</Text>
        </View>

        {isReplyVisible && <ReplyComponent commentId={parseInt(commentId)} />}
        {isReplying && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="답글을 입력하세요..."
              multiline
            />
            <Button title="등록" onPress={handleAddReply} disabled={!replyText.trim()} />
          </View>
        )}
      </View>

      <VideoMoreOptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        onReport={handleReport}
        onBlock={handleBlock}
      />

      <ReportReasonModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
      
      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userIcon: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  menuIcon: {
    padding: 4,
  },
  commentText: {
    marginBottom: 5,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  replyAction: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  replyText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 120,
  },
  replyInputContainer: {
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CommentItem;
