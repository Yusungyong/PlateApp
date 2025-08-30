// components/PlateFeed/PlateCardSkeleton.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const PlateCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />

      <View style={styles.lineShort} />
      <View style={styles.lineLong} />

      <View style={styles.tagRow}>
        <View style={styles.tag} />
        <View style={styles.tag} />
        <View style={styles.tag} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.circle} />
        <View style={styles.circle} />
      </View>

      <View style={styles.date} />
    </View>
  );
};

export default PlateCardSkeleton;

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  lineShort: {
    width: '50%',
    height: 14,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 6,
  },
  lineLong: {
    width: '80%',
    height: 14,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    width: 60,
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  circle: {
    width: 24,
    height: 24,
    backgroundColor: '#eee',
    borderRadius: 12,
  },
  date: {
    width: '40%',
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
});
