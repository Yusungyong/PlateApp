// components/PlateFeed/PlateImageSlider.tsx
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FeedImageBucket } from '../../../../config/config';

interface Props {
  images: string | null;
}

const PlateImageSlider: React.FC<Props> = ({ images }) => {
  if (!images) return null;

  const imageArray = images.split(',').map(i => i.trim()).filter(Boolean);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
      {imageArray.map((img, idx) => (
        <View key={idx} style={styles.imageWrapper}>
          <FastImage
            source={{ uri: FeedImageBucket + img }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default PlateImageSlider;

const styles = StyleSheet.create({
  slider: {
    marginBottom: 12,
  },
  imageWrapper: {
    width: 240,
    aspectRatio: 3 / 4,
    marginRight: 3,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
