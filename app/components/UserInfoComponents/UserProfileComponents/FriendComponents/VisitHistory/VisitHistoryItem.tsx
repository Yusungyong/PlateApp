import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { imageBucket, FeedImageBucket } from '../../../../../config/config';

const VisitHistoryItem = ({ item, onPress }) => {
  const imageUrl =
    item.type === 'image'
      ? `${FeedImageBucket}thumbnails/300x300/${item.image}`
      : `${imageBucket}300x300/${item.image}`;

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={() => onPress?.(item)}>
      <FastImage
        style={styles.storeImage}
        source={{ uri: imageUrl }}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.infoBox}>
        <Text style={styles.storeName} numberOfLines={1}>
          {item.storeName}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {item.address || '주소정보 없음'}
        </Text>

        <View style={styles.dateBox}>
          <Ionicons name="calendar-outline" size={13} color="#aaa" />
          <Text style={styles.visitDate}>{item.visitDate}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  storeImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginRight: 14,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  address: {
    fontSize: 13,
    color: '#666',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  visitDate: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default VisitHistoryItem;
