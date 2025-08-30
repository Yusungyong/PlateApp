import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserAvatar from './UserAvatar';
import UserInfoDisplay from './UserInfoDisplay';
import VideoStats from './VideoStats';
import FriendFinderButton from './FriendFinderButton';
import { useRegionPicker } from './ActiveRegionPicker/useRegionPicker';
import { registerActiveRegion } from '../UserOptions/RegActiveRegion';
import LoginRequiredModal from '../../../../auth/LoginRequiredModal';
import { useAuth } from '../../../../auth/AuthProvider';
import { useApiService } from '../../../../services/api/apiService';

const DEFAULT_REGION = '활동지역을 등록해주세요.';

const UserProfile = ({ userInfo, profileImage, onImagePicker }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [region, setRegion] = useState(DEFAULT_REGION);
  const [videoCnt, setVideoCnt] = useState(0);
  const [feedCnt, setFeedCnt] = useState(0);
  const { isLoggedIn, role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';
  const { openPicker, RegionPickerModal, selectedRegion } = useRegionPicker();
  const { apiCall } = useApiService();
  const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
      if (!isLoggedIn || isGuest) {
        setModalVisible(true);
      }
    }, [isLoggedIn, isGuest]);

  useEffect(() => {
    if (userInfo) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRegion(userInfo.region || DEFAULT_REGION);
      setVideoCnt(userInfo.videoCnt || 0);
      setFeedCnt(userInfo.feedCnt || 0);
    }
  }, [userInfo]);

  useEffect(() => {
    const registerRegion = async () => {
      if (selectedRegion && selectedRegion !== userInfo?.region) {
        await registerActiveRegion(selectedRegion, apiCall);
      }
      if (selectedRegion) {
        setRegion(selectedRegion);
      }
    };
    registerRegion();
  }, [selectedRegion]);

  const getDisplayName = () => {
    const { username = '사용자 이름', nickName } = userInfo || {};
    return nickName || username;
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
        <UserAvatar profileImage={profileImage} onPress={onImagePicker} />
        <View style={styles.details}>
          <UserInfoDisplay
            displayName={getDisplayName()}
            onMenuPress={() => navigation.navigate('MenuOptions')}
            isDark={isDark}
          />
          <Text
            style={[styles.regionText, isDark && { color: '#ccc' }]}
            onPress={openPicker}
          >
            {region}
          </Text>
          <View style={styles.statsRow}>
            <VideoStats videoCount={videoCnt} feedCount={feedCnt} />
            <FriendFinderButton onPress={() => navigation.navigate('FriendFinder')} />
          </View>
        </View>
      </View>

      {/* 로그인 유도 모달 */}
      <LoginRequiredModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        
      {/* 활동지역 선택 모달 */}
      {RegionPickerModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    elevation: 3,
    alignItems: 'center',
  },
  details: {
    marginLeft: 16,
    flex: 1,
  },
  regionText: {
    fontSize: 14,
    color: '#FF7F50',
    fontWeight: '500',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UserProfile;
