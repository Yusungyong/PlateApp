import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import CustomHeader from './CustomHeader';
import Footer from '../components/Footer';
import { useRoute } from '@react-navigation/native';
import HomeTopComponent from '../components/HomeContents/HomeTopComponent';

const CommonLayout = ({ children }) => {
  const route = useRoute();
  const isPlaying = route.name === '재생';
  const isHome = route.name === '홈';
  const isUpload = route.name === '업로드';

  // Footer가 보여질 스크린 목록
  const footerVisibleScreens = ['컨텐츠', '홈', '지도', '업로드', '프로필', 'StoreScreen'];
  const showFooter = footerVisibleScreens.includes(route.name);

  const FOOTER_HEIGHT = 72; // 아이콘(40) + 텍스트 + 내부패딩을 감안한 대략값
  const TOP_SPACE = Platform.OS === 'ios' ? 100 : 50; // ✅ iOS/Android 분기 적용

  return (
    <View style={[styles.container, isPlaying && styles.playingContainer]}>
      {(!isHome && !isUpload) && <CustomHeader />}
      {isHome && (
        <View style={[styles.topSpace, { height: TOP_SPACE }]}>
          <HomeTopComponent />
        </View>
      )}
      <SafeAreaView
        style={[
          styles.content,
          isPlaying && styles.playingContent,
          showFooter && { paddingBottom: FOOTER_HEIGHT },
        ]}
      >
        {children}
      </SafeAreaView>
      {showFooter && <Footer style={styles.footerOverlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  playingContainer: {
    backgroundColor: 'black',
  },
  topSpace: {
    // height는 컴포넌트 내부에서 Platform 분기로 처리
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  playingContent: {
    backgroundColor: 'black',
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CommonLayout;
