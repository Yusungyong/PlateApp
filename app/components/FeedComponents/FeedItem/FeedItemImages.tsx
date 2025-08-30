import React, { useState, useMemo, useRef } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { FeedImageBucket } from '../../../config/config';

const deviceWidth = Dimensions.get('window').width;
const maxHeight = 530;

// ✅ 단일 prop: feed
const FeedItemImages = ({ feed }) => {
  const navigation = useNavigation();

  const { id: feedId, username, images } = feed ?? {};
  const imageUrls = useMemo(() => {
    return images ? images.split(', ').map((img) => FeedImageBucket + img) : [];
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef(null);

  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / deviceWidth);
    setSelectedIndex(index);
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>이미지가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.imageWrapper}>
      <FlatList
        ref={flatListRef}
        data={imageUrls}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialNumToRender={2}
        windowSize={2}
        removeClippedSubviews={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('FeedImageViewer', {
                feedId,
                username,
                initialIndex: index,
              })
            }
          >
            <View
              style={[
                styles.imageContainer,
                {
                  width: deviceWidth,
                  height: maxHeight,
                  backgroundColor: '#111',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <FastImage
                source={{ uri: item, priority: FastImage.priority.normal }}
                style={{
                  width: deviceWidth,
                  height: maxHeight,
                  opacity: 1,
                }}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          {selectedIndex + 1} / {imageUrls.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    position: 'relative',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  pageText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default FeedItemImages;
