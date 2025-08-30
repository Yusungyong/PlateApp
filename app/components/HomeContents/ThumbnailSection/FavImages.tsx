import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { imageBucket } from '../../../config/config';
import { formatDuration } from '../../../../common/formatUtil/format';

interface ThumbnailCarouselProps {
  title?: string;
  thumbnails: string[];
  captions?: string[];
  storeIds: string[];
  durations?: number[]; // ✅ 변경: number[]로 받음
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const horizontalSpacing = 8;
const sidePadding = 20;

const getThumbnailSize = () => {
  const totalSpacing = horizontalSpacing * 2;
  return (SCREEN_WIDTH - totalSpacing - sidePadding) / 3;
};

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({
  title = '새로 등록된 동영상',
  thumbnails,
  captions = [],
  storeIds,
  durations = [],
}) => {
  const thumbnailSize = getThumbnailSize();
  const snapInterval = thumbnailSize + horizontalSpacing;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scaleRefs = useRef<Animatable.View[]>([]);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleImageTap = (index: number) => {
    const storeId = storeIds[index];
    navigation.navigate('재생', { storeId });
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const caption = captions[index] || '';
    const rawDuration = durations[index];
    const durationText = rawDuration;
    const height = thumbnailSize;

    return (
      <Animatable.View
        ref={(ref) => {
          if (ref) scaleRefs.current[index] = ref;
        }}
        animation="fadeInUp"
        delay={index * 100}
        style={[
          styles.imageWrapper,
          {
            marginHorizontal: horizontalSpacing / 2,
            width: thumbnailSize,
            height,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={() => scaleRefs.current[index]?.pulse?.(150)}
          onPress={() => handleImageTap(index)}
          style={[styles.card, isDark && { backgroundColor: '#333' }]}
        >
          <FastImage
            source={{ uri: item || `${imageBucket}/default-thumbnail.png` }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />

          {(caption || durationText) && (
            <View style={styles.overlayRow}>
              <Text
                style={styles.captionText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {caption}
              </Text>
              {durationText ? (
                <Text style={styles.durationText}>{durationText}</Text>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Animated.FlatList
        data={thumbnails}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        scrollEventThrottle={16}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 12,
    marginBottom: 10,
    color: '#333',
  },
  container: {
    paddingHorizontal: 10,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayRow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  captionText: {
    color: '#f5f5f5',
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
    marginRight: 6,
    flex: 1,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    flexShrink: 0,
  },
});

export default ThumbnailCarousel;
