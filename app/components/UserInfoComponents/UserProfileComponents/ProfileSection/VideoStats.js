import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // for filled video
import Feather from 'react-native-vector-icons/Feather'; // for outlined chat

const VideoStats = ({ videoCount, feedCount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Ionicons name="videocam" size={16} color="#FF7F50" />
        <Text style={styles.countText}>{videoCount}</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="message-circle" size={16} color="#FF7F50" />
        <Text style={styles.countText}>{feedCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginLeft:10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});

export default VideoStats;
