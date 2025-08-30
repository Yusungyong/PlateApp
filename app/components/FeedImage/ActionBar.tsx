import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ActionBar({
  liked,
  likeCount,
  commentCount,
  onLikePress,
  onCommentPress,
  onLocationPress,
  onMenuPress,
}) {
  return (
    <View style={styles.overlayRight}>
      <TouchableOpacity style={styles.iconButton} onPress={onLikePress}>
        <Icon name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? 'red' : '#fff'} />
        <Text style={styles.countText}>{likeCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onCommentPress}>
        <Icon name="chatbubble-outline" size={26} color="#fff" />
        <Text style={styles.countText}>{commentCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onLocationPress}>
        <Icon name="location-outline" size={26} color="#fff" />
        <Text style={styles.labelText}>위치</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
        <Icon name="menu-outline" size={26} color="#fff" />
        <Text style={styles.labelText}>메뉴</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRight: {
    position: 'absolute',
    right: 10,
    bottom: Platform.OS === 'ios' ? 80 : 80,
    alignItems: 'center',
    
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
