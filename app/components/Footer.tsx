import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginRequiredModal from '../auth/LoginRequiredModal';
import { useAuth } from '../auth/AuthProvider';

export const scrollHandlersRef: any = {
  current: {},
};

const { width } = Dimensions.get('window');
const PLAY_ROUTE = '재생';

// 아이콘 이름은 Ionicons 기준으로 예시 넣어둠
// 필요에 따라 home → home-outline, home → home 등 적절히 변경 가능
const TABS = [
  { key: 'contents', label: '컨텐츠', route: '컨텐츠', icon: 'albums-outline', activeIcon: 'albums' },
  { key: 'map',      label: '지도',   route: '지도',   icon: 'map-outline',    activeIcon: 'map' },
  { key: 'home',     label: '홈',     route: '홈',     icon: 'home-outline',   activeIcon: 'home' },
  { key: 'upload',   label: '업로드', route: '업로드', icon: 'cloud-upload-outline', activeIcon: 'cloud-upload' },
  { key: 'profile',  label: '프로필', route: '프로필', icon: 'person-outline', activeIcon: 'person' },
];

const Footer = React.memo(({ style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const isPlaying = route.name === PLAY_ROUTE;

  const handleTabPress = (tabRoute: string) => {
    if (isGuest && (tabRoute === '업로드' || tabRoute === '프로필')) {
      setLoginModalVisible(true);
      return;
    }
    if (route.name === tabRoute) {
      const handler = scrollHandlersRef.current[tabRoute];
      if (handler) handler();
    } else {
      navigation.navigate(tabRoute);
    }
  };

  return (
    <>
      <View style={[styles.container, isPlaying && styles.playingContainer, style]}>
        <View style={styles.tabRow}>
          {TABS.map(tab => {
            const isActive  = route.name === tab.route;
            const isPlayTab = tab.route === PLAY_ROUTE;

            const iconName = isActive ? tab.activeIcon : tab.icon;
            const iconColor = isPlaying 
              ? (isPlayTab ? '#FF7F50' : 'white') 
              : (isActive ? '#FF7F50' : 'black');

            const textStyle = isPlaying
              ? (isPlayTab ? styles.activeTabText : styles.whiteTabText)
              : (isActive ? styles.activeTabText : styles.defaultTabText);

            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => handleTabPress(tab.route)}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Icon name={iconName} size={20} color={iconColor} />
                <Text style={[styles.tabText, textStyle]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.3,
    borderTopColor: '#000',
    backgroundColor: '#fff',
    paddingTop: 4,
    paddingBottom: 20,
  },
  playingContainer: {
    backgroundColor: 'black',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: width * 0.03,
    marginTop: 2,
  },
  defaultTabText: {
    color: 'black',
  },
  activeTabText: {
    color: '#FF7F50',
  },
  whiteTabText: {
    color: 'white',
  },
});

export default Footer;
