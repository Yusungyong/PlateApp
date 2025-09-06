import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import CustomNewsViewer from './CustomNewsViewer';
import CommonLayout from '../../../../common/CommonLayout';

type ParamList = {
  NewsDetailScreen: {
    mainContent: string;
  };
};

const NewsDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'NewsDetailScreen'>>();
  const { mainContent } = route.params;

  return (
    <CommonLayout>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <CustomNewsViewer mainContent={mainContent} />
      </ScrollView>
    </CommonLayout>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff', // ✅ 공통 배경
  },
  content: {
    paddingBottom: 200,
  },
});
