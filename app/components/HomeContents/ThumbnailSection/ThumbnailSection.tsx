import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import useThumbnails from './useThumbnails';
import ThumbnailCarousel from './FavImages';
import { imageBucket } from '../../../config/config';
import { formatDuration } from '../../../common/formatUtil/format';

const ThumbnailSection: React.FC = (location) => {
  const { thumbnails, loading, error } = useThumbnails();
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f80ed" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>썸네일 로딩 오류: {error.message}</Text>
      </View>
    );
  }

  const thumbnailUrls = thumbnails.map((item) => imageBucket + item.thumbnail);
  const storeIds = thumbnails.map((item) => String(item.storeId));
  const captions = thumbnails.map((item) => item.title);
  const durations = thumbnails.map((item) => formatDuration(item.videoDuration));

  return (
    <ThumbnailCarousel
      storeIds={storeIds}
      thumbnails={thumbnailUrls}
      captions={captions}
      durations={durations}
      thumbnailSize={120}
    />
  );
};

export default ThumbnailSection;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
