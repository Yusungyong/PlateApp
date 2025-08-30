// components/MapView/SearchMarkers.tsx
import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { imageBucket, FeedImageBucket } from '../../config/config';
import useClusterize from './useClusterize';

type SearchMarkersProps = {
  data: any[]; // 필요시 정확한 타입 정의
  onClusterPress?: (group: any[]) => void;
};

const SearchMarkers: React.FC<SearchMarkersProps> = ({ data, onClusterPress }) => {
  const clusters = useClusterize(data);
  console.log(data);
  return (
    <>
      {clusters.map((group, index) => {
        const first = group[0];
        if (!first) return null;

        const {
          latitude,
          longitude,
          storeId,
          thumbnail,
          storeName,
          formattedAddress,
        } = first;

        const coordinate = {
          latitude: Number(latitude),
          longitude: Number(longitude),
        };

        if (group.length === 1) {
          const baseUrl = Number(storeId) === 0 ? FeedImageBucket : imageBucket;
          const thumbnailArr = thumbnail?.split(',') || [];
          const firstThumbnail = thumbnailArr[0]?.trim() || '';
          const imageUrl = `${baseUrl}300x300/${firstThumbnail}`;

          return (
            <Marker
              key={`marker-${index}`}
              coordinate={coordinate}
              onPress={() => onClusterPress?.(group)}
              title={storeName || 'No Title'}
              description={formattedAddress || ''}
            >
              <FastImage
                source={{ uri: imageUrl }}
                style={styles.markerImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Marker>
          );
        } else {
          return (
            <Marker
              key={`cluster-${index}`}
              coordinate={coordinate}
              onPress={() => onClusterPress?.(group)}
              title={`${group.length}개의 장소`}
            >
              <View style={styles.clusterContainer}>
                <Text style={styles.clusterText}>{group.length}</Text>
              </View>
            </Marker>
          );
        }
      })}
    </>
  );
};

const styles = StyleSheet.create({
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default memo(SearchMarkers);
