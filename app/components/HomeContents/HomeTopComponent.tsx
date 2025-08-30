import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import NotificationModal from '../../notifications/NotificationModal';
import { useApiService } from '../../services/api/apiService';

const APP_TITLE = '접시';

const HomeTopComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const { apiCall } = useApiService();
  const navigation = useNavigation();

  useEffect(() => {
    loadReceiverId();
  }, []);

  useEffect(() => {
    if (receiverId) {
      fetchNotifications();
    }
  }, [receiverId]);

  // FCM 메시지 수신 시 알림 목록 새로고침
  useEffect(() => {
    if (!receiverId) return;
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      fetchNotifications();
    });
    return unsubscribe;
  }, [receiverId]);

  const loadReceiverId = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setReceiverId(storedUsername);
      } else {
        console.warn('username이 AsyncStorage에 없습니다.');
        // navigation.navigate('LoginScreen'); // 필요시 추가
      }
    } catch (error) {
      console.error('AsyncStorage에서 username 읽기 실패:', error);
      Alert.alert('알림', '사용자 정보를 불러오지 못했습니다.');
    }
  };

  const fetchNotifications = async () => {
    if (!receiverId) return;
    try {
      const response = await apiCall({
        method: 'GET',
        url: `/api/notifications/${receiverId}`,
      });
      setNotifications(response);
    } catch (error) {
      Alert.alert('알림', '알림을 불러오지 못했습니다.');
      console.error('알림 가져오기 실패:', error);
    }
  };

const handleNotificationPress = () => {
  setModalVisible(true); // 이걸 최우선!
  // 아래는 비동기 로직 그대로
  if (notifications.length > 0) {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length > 0) {
      Promise.all(
        unreadNotifications.map((notification) =>
          apiCall({
            method: 'PATCH',
            url: `/api/notifications/${notification.id}/read`,
          })
        )
      )
        .then(() => fetchNotifications())
        .catch((error) => {
          Alert.alert('알림', '알림 읽음 처리에 실패했습니다.');
          console.error('읽음 처리 실패:', error);
        });
    }
  }
};


  const handleSearchPress = () => {
    navigation.navigate('StoreScreen');
  };

  const handleTitlePress = async () => {
    // 개발자/디버그 용도
  };

  const closeModal = () => {
    setModalVisible(false);
    fetchNotifications(); // 모달 닫을 때 목록 새로고침
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.titleRow}
          onPress={handleTitlePress}
          activeOpacity={0.7}
        >
          <Image source={require('../../../images/footerIcon/old/logo.png')} style={styles.logo} />
          <Text style={styles.title}>{APP_TITLE}</Text>
        </TouchableOpacity>
        <View style={styles.iconGroup}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="search-outline" size={28} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNotificationPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.iconWrapper}>
              <Icon name="notifications-outline" size={28} color="#444" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <NotificationModal
          visible={modalVisible}
          onClose={closeModal}
          notifications={notifications}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    minHeight: 54,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 6,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 2,
    color: '#222',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -7,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HomeTopComponent;
