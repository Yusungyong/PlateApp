import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { timeAgo } from '../common/dataUtil/dateUtil';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: NotificationVO[];
}

interface NotificationVO {
  id: number;
  receiverId: number;
  senderId: number | null;
  type: string; // 'video' | 'feed'
  referenceId: number | null;
  commentId?: number | null;
  replyId?: number | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  notifications,
}) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const onNotificationPress = (item: NotificationVO) => {
    const { type, referenceId, receiverId, commentId, replyId } = item;

    if (type === 'video') {
      onClose();
      navigation.navigate('재생', {
        storeId: referenceId,
        passedUsername: 'noti',
        ...(commentId ? { scrollToCommentId: commentId } : {}),
        ...(replyId ? { scrollToReplyId: replyId } : {}),
      });
    }

    if (type === 'feed') {
      onClose();
      navigation.navigate('FeedImageViewer', {
        feedId: referenceId,
        username: receiverId.toString(),
        ...(commentId ? { scrollToCommentId: commentId } : {}),
        ...(replyId ? { scrollToReplyId: replyId } : {}),
      });
    }
  };

  const renderItem = ({ item }: { item: NotificationVO }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => onNotificationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.titleRow}>
        <Text style={styles.notificationTitle}>
          {item.type === 'system' ? '공지사항' : '알림'}
        </Text>
        <Text style={styles.notificationTimeInline}>
          {timeAgo(item.createdAt)}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}
        >
          <SafeAreaView style={styles.safeArea}>
            <Text style={styles.modalTitle}>알림</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.notificationList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>알림이 없습니다.</Text>
              }
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationTimeInline: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 14,
  },
});

export default NotificationModal;
