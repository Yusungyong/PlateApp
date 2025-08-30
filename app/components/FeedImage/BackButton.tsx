import React from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Icon name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 24,
  },
});
