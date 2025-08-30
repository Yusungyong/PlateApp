import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const StoreImageSlider = ({ thumbnails, imageBase }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.imageSlider}
    contentContainerStyle={{ paddingHorizontal: 8 }}
  >
    {thumbnails.length > 0 ? (
      thumbnails.map((src, idx) => (
        <FastImage
          key={idx}
          source={{ uri: imageBase + src }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ))
    ) : (
      <View style={[styles.image, styles.noImage]}>
        <Text style={{ color: '#888' }}>이미지 없음</Text>
      </View>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  imageSlider: {
    flexDirection: 'row',
    width,
    minHeight: 230,
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    width: width * 0.7,
    height: 220,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreImageSlider;
