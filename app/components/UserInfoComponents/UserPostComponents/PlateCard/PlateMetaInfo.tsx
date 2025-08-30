// components/PlateFeed/PlateMetaInfo.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  likeCount: number;
  commentCount: number;
  onLikePress: () => void;
  onCommentPress: () => void;
}

const PlateMetaInfo: React.FC<Props> = ({
  likeCount,
  commentCount,
  onLikePress,
  onCommentPress,
}) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onLikePress} style={styles.metaItem}>
        <Icon name="heart" size={20} color="#FF7F50" />
        <Text style={styles.metaText}>{likeCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCommentPress} style={styles.metaItem}>
        <Icon name="message-circle" size={20} color="#FF7F50" />
        <Text style={styles.metaText}>{commentCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlateMetaInfo;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 1, // ← 살짝 여백 줄이기
  },
  metaText: {
    fontSize: 13,
    color: '#555',
  },
});
