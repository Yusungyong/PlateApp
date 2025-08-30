import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HomeNewsSection from './HomeNewsSection/NewsEditor/HomeNewsSection';
import useNews from './HomeNewsSection/NewsEditor/useNews';

const NewsSection: React.FC = () => {
  const { newsList, loading, error } = useNews();

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>뉴스 로딩 오류: {error.message}</Text>
      </View>
    );
  }

  if (loading || !newsList.length) {
    return null;
  }

  return (
    <HomeNewsSection
      newsList={newsList.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.content,
        mainContent: item.mainContentStr,
      }))}
    />
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default NewsSection;
