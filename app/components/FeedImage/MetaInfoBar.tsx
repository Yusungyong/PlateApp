import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileImage from '../../common/imageUtil/ProfileImage';

export default function MetaInfoBar({ profileImageUrl, username, content, tags }) {
  return (
    <View style={styles.overlayBottom}>
      <View style={styles.metaInfo}>
        <ProfileImage imageKey={profileImageUrl || ''} size={36} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>
      <Text style={styles.tags}>{tags.join(' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayBottom: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  content: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  tags: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 12,
  },
});
