import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import CustomNewsViewer from './CustomNewsViewer';

type ParamList = {
  NewsDetailScreen: {
    mainContent: string;
  };
};

const NewsDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'NewsDetailScreen'>>();
  const { mainContent } = route.params;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <CustomNewsViewer mainContent={mainContent} />
    </ScrollView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff', // ✅ 여기에 배경 지정
  },
  content: {
    paddingBottom: 200,
  },
});
