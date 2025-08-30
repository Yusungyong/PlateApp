import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const StoreActionButton = ({ onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Text style={styles.actionBtnText}>이 가게에 리뷰 남기기</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 18,
    width: width * 0.85,
    alignItems: 'center',
    position: 'relative',
    marginTop: 14,
    marginBottom: 24,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default StoreActionButton;
