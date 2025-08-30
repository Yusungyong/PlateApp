import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { imageBucket } from '../../../config/config';

export interface PostThumbnailItemProps {
  post: {
    id?: number | string;
    thumbnail?: string;
  };
}

const PostThumbnailItem: React.FC<PostThumbnailItemProps> = memo(({ post }) => (
  <View style={styles.wrapper}>
    <FastImage
      source={post.thumbnail ? { uri: imageBucket + '300x300/' + post.thumbnail } : require('../../../../images/footerIcon/old/logo.png')}
      style={styles.image}
      resizeMode={FastImage.resizeMode.cover}
    />
    <View style={styles.overlay}>
      <Icon name="play-circle-outline" size={28} color="#fff" />
    </View>
  </View>
));

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
});

export default PostThumbnailItem;
