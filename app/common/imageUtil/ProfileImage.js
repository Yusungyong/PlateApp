import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import { profileBucket } from '../../config/config';

const S3_BASE_URL = profileBucket;

const ProfileImage = ({ imageKey, size = 50, style, ...props }) => {
  const [viewerVisible, setViewerVisible] = useState(false);

  if (!imageKey) {
    return (
      <View
        style={[
          styles.iconContainer,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      >
        <Icon name="person-outline" size={size * 0.5} color="#fff" />
      </View>
    );
  }

  const imageUrl = `${S3_BASE_URL}${imageKey}`;

  return (
    <>
      <TouchableOpacity onPress={() => setViewerVisible(true)}>
        <FastImage
          source={{
            uri: imageUrl,
            cache: FastImage.cacheControl.immutable,
          }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
            style,
          ]}
          resizeMode={FastImage.resizeMode.cover}
          onError={(error) => {
            console.error('ProfileImage load error: ', error);
          }}
          {...props}
        />
      </TouchableOpacity>

      <ImageView
        images={[{ uri: imageUrl }]}
        imageIndex={0}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#ccc',
  },
  iconContainer: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileImage;
