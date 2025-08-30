import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  imageUrl?: string;
  title: string;
  description: string;
  onPress?: () => void;
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/80x80.png?text=No+Image'; // 기본 이미지

const HomeNewsCard: React.FC<Props> = ({ imageUrl, title, description, onPress }) => {
  const isValidImage = imageUrl && imageUrl.trim() !== '';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <FastImage
        source={{ uri: isValidImage ? imageUrl : DEFAULT_IMAGE }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
});

export default HomeNewsCard;
