import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { imageBucket, FeedImageBucket } from '../../../app/config/config';
import { useNavigation } from '@react-navigation/native';

interface StoreCardProps {
  item: {
    storeName: string;
    address: string;
    username: string;
    thumbnail?: string;
    postCount?: number;
    type: 'video' | 'feed';
    distance?: string;
  };
  onPress?: () => void; // (기존 onPress props도 지원)
}

const StoreCard: React.FC<StoreCardProps> = ({ item, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // 외부에서 onPress 넘겨주면 그거 먼저 실행, 아니면 네비게이션 이동
    if (onPress) return onPress();
    navigation.navigate('StoreDetailScreen', { item });
  };

  const firstThumbnail = item.thumbnail?.split(',')[0] || '';
  const imageUrl =
    (item.type === 'video' ? imageBucket + '300x300/' : FeedImageBucket + 'thumbnails/300x300/') + firstThumbnail;
  console.log('StoreCard imageUrl:', imageUrl);
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.thumbnailWrapper}>
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          style={styles.thumbnail}
        />
        {item.postCount > 1 && (
          <View style={styles.overlayBadge}>
            <Text style={styles.overlayText}>+{item.postCount - 1}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.storeName}</Text>
        <Text style={styles.text}>
          {item.address?.split(' ').slice(0, 2).join(' ')}
        </Text>
        <Text style={styles.text}>작성자: {item.username}</Text>
        {item.distance !== undefined && (
          <Text style={[styles.text, styles.distance]}>
            {item.distance}
          </Text>
        )}
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{item.type === 'video' ? '영상' : '피드'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

// styles 부분은 그대로 복사 (생략)
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 8,
    padding: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  overlayBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  distance: {
    color: '#007AFF',
    fontWeight: '500',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badge: {
    fontSize: 12,
    color: '#444',
  },
});
