import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function DotIndicator({ count, current }) {
  return (
    <View style={styles.dotContainer}>
      {Array.from({ length: count }).map((_, idx) => (
        <View
          key={idx}
          style={[styles.dot, { opacity: idx === current ? 1 : 0.3 }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});
