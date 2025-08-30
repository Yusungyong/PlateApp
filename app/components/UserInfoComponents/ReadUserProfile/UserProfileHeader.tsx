import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileImage from '../../../common/imageUtil/ProfileImage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ACTIVE_COLOR = '#FF7F50';
const INACTIVE_BG = '#f6f6f6';
const INACTIVE_TEXT = '#b1b1b1';

export interface UserProfileHeaderProps {
  user: {
    username?: string;
    nickName?: string;
    profileImageUrl?: string;
    activeRegion?: string;
    videoCount?: number;
    feedCount?: number;
  };
  selectedTab: 'video' | 'feed' | 'map';
  onProfileImagePress: () => void;
  onTabPress: (tab: 'video' | 'feed' | 'map') => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user, selectedTab, onProfileImagePress, onTabPress
}) => {
  return (
    <View style={styles.container}>
      {/* 프로필 이미지 - 왼쪽 */}
      <TouchableOpacity onPress={onProfileImagePress} activeOpacity={0.85}>
        <ProfileImage
          imageKey={user.profileImageUrl}
          size={88}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {/* 오른쪽 정보영역 */}
      <View style={styles.infoSection}>
        <Text style={styles.username}>{user.nickName || user.username || '이름 없음'}</Text>
        <Text style={styles.region}>{user.activeRegion || '정보 없음'}</Text>
        <View style={{ flex: 1 }} />
        {/* 첫번째 줄: 영상, 피드 */}
        <View style={styles.countRow}>
          <TouchableOpacity
            style={[
              styles.countBox,
              selectedTab === 'video' && styles.countBoxActive,
            ]}
            onPress={() => onTabPress('video')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="play-circle-outline"
              size={19}
              color={selectedTab === 'video' ? ACTIVE_COLOR : INACTIVE_TEXT}
              style={styles.icon}
            />
            <Text style={[
              styles.countNum,
              selectedTab === 'video' && { color: ACTIVE_COLOR }
            ]}>
              {user.videoCount ?? 0}
            </Text>
            <Text style={[
              styles.countLabel,
              selectedTab === 'video' && { color: ACTIVE_COLOR }
            ]}>
              영상
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.countBox,
              selectedTab === 'feed' && styles.countBoxActive,
            ]}
            onPress={() => onTabPress('feed')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={18}
              color={selectedTab === 'feed' ? ACTIVE_COLOR : INACTIVE_TEXT}
              style={styles.icon}
            />
            <Text style={[
              styles.countNum,
              selectedTab === 'feed' && { color: ACTIVE_COLOR }
            ]}>
              {user.feedCount ?? 0}
            </Text>
            <Text style={[
              styles.countLabel,
              selectedTab === 'feed' && { color: ACTIVE_COLOR }
            ]}>
              피드
            </Text>
          </TouchableOpacity>
        </View>
        {/* 두번째 줄: 지도 pill (크기 Up!) */}
        <View style={styles.countRowSingle}>
          <TouchableOpacity
            style={[
              styles.countBoxMap,
              selectedTab === 'map' && styles.countBoxActiveMap,
            ]}
            onPress={() => onTabPress('map')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="location-outline"
              size={21}
              color={selectedTab === 'map' ? ACTIVE_COLOR : INACTIVE_TEXT}
              style={styles.icon}
            />
            <Text style={[
              styles.countLabelMap,
              selectedTab === 'map' && { color: ACTIVE_COLOR }
            ]}>
              지도
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // ★ 수직 중앙 정렬
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f8',
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginRight: 22,
    borderWidth: 1.5,
    borderColor: '#e4eaf6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 88,
    height: 88,
    paddingTop: 2,
    paddingBottom: 2,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212226',
    marginBottom: 6,
    letterSpacing: -0.2,
    textAlign: 'left',
    width: '100%',
  },
  region: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 0,
    letterSpacing: -0.5,
    textAlign: 'left',
    width: '100%',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 12,
    marginTop: 10,
    marginBottom: 0,
  },
  countRowSingle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    gap: 0,
    marginTop: 11,
    marginBottom: 2,
  },
  countBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INACTIVE_BG,
    paddingHorizontal: 13,
    paddingVertical: 4,
    minWidth: 60,
    justifyContent: 'center',
    borderRadius: 16,
    marginRight: 3,
  },
  countBoxActive: {
    backgroundColor: '#fff0e8',
    borderWidth: 1,
    borderColor: ACTIVE_COLOR,
  },
  // 지도 Pill만 크기 크게
  countBoxMap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INACTIVE_BG,
    paddingHorizontal: 13,
    paddingVertical: 4,
    minWidth: 60,
    justifyContent: 'center',
    borderRadius: 16,
  },
  countBoxActiveMap: {
    backgroundColor: '#fff0e8',
    borderWidth: 1.5,
    borderColor: ACTIVE_COLOR,
  },
  icon: {
    marginRight: 6,
  },
  countNum: {
    fontSize: 17,
    fontWeight: 'bold',
    color: INACTIVE_TEXT,
    marginRight: 4,
  },
  countLabel: {
    fontSize: 14,
    color: INACTIVE_TEXT,
  },
  countLabelMap: {
    fontSize: 16,
    color: INACTIVE_TEXT,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
});

export default UserProfileHeader;
