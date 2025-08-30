import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FeedImageBucket } from '../../../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FeedThumbnailItemProps {
  feed: {
    feedId: number | string;
    images: string | string[];
    title?: string;
    excerpt?: string;
  };
  onPressImage: (imageIndex: number) => void;
}

const FeedThumbnailItem: React.FC<FeedThumbnailItemProps> = ({ feed, onPressImage }) => {
  let imageName = '';
  let imageCount = 0;
  let imagesArr: string[] = [];
  if (Array.isArray(feed.images)) {
    imagesArr = feed.images.filter(Boolean);
    imageName = imagesArr[0] || '';
    imageCount = imagesArr.length;
  } else if (typeof feed.images === 'string') {
    imagesArr = feed.images ? feed.images.split(',').filter(s => !!s) : [];
    imageName = imagesArr[0] || '';
    imageCount = imagesArr.length;
  }

  const thumbnailUrl = imageName ? FeedImageBucket + 'thumbnails/300x300/' + imageName : '';

  return (
    <TouchableOpacity onPress={() => onPressImage(0)} activeOpacity={0.9} style={styles.container}>
      {thumbnailUrl ? (
        <FastImage
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={styles.image} />
      )}
      {imageCount > 1 && (
        <View style={styles.badge}>
          <Ionicons name="images-outline" size={13} color="#fff" style={{ marginRight: 2 }} />
          <Text style={styles.badgeText}>{imageCount}</Text>
        </View>
      )}
      <View style={styles.infoOverlay}>
        <Text style={styles.title} numberOfLines={1}>{feed.content || '피드 제목'}</Text>
        {feed.excerpt ? (
          <Text style={styles.excerpt} numberOfLines={1}>{feed.excerpt}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ececec',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.13)',
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  excerpt: {
    color: '#f8f8f8',
    fontSize: 10,
    marginTop: 1,
  },
});

export default FeedThumbnailItem;
