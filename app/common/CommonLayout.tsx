import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
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
  // (프로젝트에 따라 64~80 사이로 미세 조정)
  return (
    <View style={[styles.container, isPlaying && styles.playingContainer]}>
      {(!isHome && !isUpload) && <CustomHeader />}
      {isHome && (
        <View style={styles.topSpace}>
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
    height: 100,
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
