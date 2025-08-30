import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import StoreTabs from './StoreTabs';
import StoreInfoSection from './StoreInfoSection';
import StoreFeedSection from './StoreFeedSection';
import StoreMenuSection from './StoreMenuSection';
import StoreMapSection from './StoreMapSection';

import { imageBucket, FeedImageBucket } from '../../../config/config';
import { useStoreDetail } from './useStoreDetail';

const { width } = Dimensions.get('window');
const TABS = ['정보', '리뷰', '메뉴'];

const StoreDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params;
  const [tab, setTab] = useState(0);

  // ✅ 상세 정보 API 요청
  const { detail, loading, error } = useStoreDetail(item.storeName, item.placeId);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ marginTop: 40, textAlign: 'center' }}>{error}</Text>;
  if (!detail) return <Text style={{ marginTop: 40, textAlign: 'center' }}>데이터가 없습니다.</Text>;

  // ✅ 카드 방식과 동일하게 이미지 URL 생성
  const firstThumbnail = item.thumbnail ? item.thumbnail.split(',')[0].trim() : '';
  const imageUrl = firstThumbnail
    ? (item.type === 'video'
        ? `${imageBucket}300x300/${firstThumbnail}`
        : `${FeedImageBucket}thumbnails/300x300/${firstThumbnail}`)
    : null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* 대표 이미지 */}
      <View style={styles.thumbnailWrapper}>
        {imageUrl ? (
          <FastImage
            source={{ uri: imageUrl, priority: FastImage.priority.normal }}
            style={styles.thumbnail}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <Text style={styles.noImageText}>이미지 없음</Text>
          </View>
        )}
      </View>

      {/* 탭 */}
      <StoreTabs tabs={TABS} currentTab={tab} onTabChange={setTab} />

      <View style={styles.card}>
        {tab === 0 && (
          <StoreInfoSection
            item={{
              ...detail,
              storeName: detail.storeName,
              address: detail.address,
              username: detail.username,
              reviewCount: detail.reviewCount,
              updatedAt: detail.updatedAt,
            }}
          />
        )}

        {tab === 1 && (
          <StoreFeedSection
            storeName={detail.storeName}
            placeId={detail.placeId}
            onFeedPress={(feed) => navigation.navigate('FeedDetailScreen', { feed })}
          />
        )}

        {tab === 2 && (
          <StoreMenuSection
            placeId={detail.placeId}
            storeName={detail.storeName}
          />
        )}
      </View>

      {/* 지도 */}
      {detail.latitude != null && detail.longitude != null && (
        <StoreMapSection
          latitude={detail.latitude}
          longitude={detail.longitude}
          name={detail.storeName}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#f6f6f6' },
  container: { alignItems: 'center', paddingBottom: 40, paddingTop: 60 },
  thumbnailWrapper: { marginBottom: 16 },
  thumbnail: {
    width: width * 0.92,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  noImageText: { fontSize: 12, color: '#999' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 16,
    width: width * 0.92,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default StoreDetailScreen;
