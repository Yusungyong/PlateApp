import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoreReviewSection = ({ reviews }) => (
  <View style={{ padding: 12 }}>
    {reviews && reviews.length > 0 ? (
      reviews.map((review, idx) => (
        <View key={idx} style={styles.reviewRow}>
          <Text style={styles.reviewer}>{review.userName}</Text>
          <Text style={styles.reviewText}>{review.content}</Text>
        </View>
      ))
    ) : (
      <Text style={{ color: '#777', fontSize: 15 }}>아직 등록된 리뷰가 없습니다.</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  reviewRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingBottom: 8,
  },
  reviewer: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 3,
  },
  reviewText: {
    color: '#222',
    fontSize: 15,
  },
});

export default StoreReviewSection;
