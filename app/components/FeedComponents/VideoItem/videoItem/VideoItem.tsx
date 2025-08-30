import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  Alert,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import VideoItemHeader from './VideoItemHeader';
import FeedItemVideos from '../FeedItemVideos/FeedItemVideos';
import VideoDescription from './VideoDescription';
import VideoItemFooter from './VideoItemFooter/VideoItemFooter';
import { useBlockUser } from '../../FeedItem/useBlockUser';
import { useSubmitReport } from '../../FeedItem/useSubmitReport';
import ReportReasonModal from '../../FeedItem/ReportReasonModal';
import VideoMoreOptionsModal from './VideoMoreOptionsModal';

const VideoItem = React.memo(({ item, isActive }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isReported, setIsReported] = useState(item.targetFlag === 'Y'); // 👈 최초 상태

  const navigation = useNavigation();
  const { blockUser } = useBlockUser();
  const { submitReport } = useSubmitReport();

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        setCurrentUser(username);
      } catch (error) {
        console.error('Error getting username from AsyncStorage:', error);
      }
    };
    getUsername();
  }, []);

  const handleModalOpen = (target) => {
    setSelectedTarget(target);
    setModalVisible(true);
  };

  const handleReport = () => {
    setModalVisible(false);
    setReasonModalVisible(true);
  };

  const handleSubmitReason = async (reason) => {
    setReasonModalVisible(false);
    if (!currentUser || !selectedTarget) return;

    const reportPayload = {
      reporterUsername: currentUser,
      targetUsername: selectedTarget.username,
      targetType: 'video',
      targetId: selectedTarget.storeId,
      reason,
      submittedAt: new Date().toISOString(),
    };

    try {
      await submitReport(reportPayload);
      console.log('📤 신고 전송 완료', reportPayload);
      setIsReported(true); // 👈 신고 완료 후 제재 상태로 변경
    } catch (e) {
      console.error('🚨 신고 전송 실패:', e);
    }
  };

  const handleBlockUser = async (targetUsername) => {
    if (!currentUser) return;

    try {
      const now = new Date().toISOString();
      const response = await blockUser({
        blockerUsername: currentUser,
        blockedUsername: targetUsername,
        blockedAt: now,
      });
      
      Alert.alert('차단 완료', `${targetUsername}님을 차단했습니다.`);

    } catch (error) {
      Alert.alert('차단 실패', response.message || '차단 요청에 실패했습니다.');
      Alert.alert('차단 오류', '차단 요청 중 오류가 발생했습니다.');
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.videoItem}>
      {isReported ? (
        <View style={styles.reportedOverlay}>
          <Text style={styles.reportedText}>🚫 사용자 신고로 제재중인 콘텐츠입니다.</Text>
        </View>
      ) : (
        <>
          <VideoItemHeader
            videoData={item}
            currentUser={currentUser}
            onModalOpen={() => handleModalOpen(item)}
            onBlockUserPress={handleBlockUser}
          />

          <View style={styles.videoContainer}>
            <FeedItemVideos
              videos={item.url}
              storeId={item.storeId}
              isActive={isActive}
            />
          </View>

          <VideoDescription
            username={item.username}
            title={item.title}
            description={item.description}
          />

          <VideoItemFooter videoData={item} />
        </>
      )}

      <VideoMoreOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onReport={handleReport}
        onBlock={() => handleBlockUser(item.username)}
      />

      <ReportReasonModal
        visible={reasonModalVisible}
        onClose={() => setReasonModalVisible(false)}
        onSubmit={handleSubmitReason}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  videoItem: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingTop: 5,
    elevation: 2,
  },
  videoContainer: {
    width: '100%',
  },
  reportedOverlay: {
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportedText: {
    color: '#721c24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoItem;
