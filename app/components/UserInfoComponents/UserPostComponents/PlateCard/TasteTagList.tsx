// components/PlateFeed/TasteTagList.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  tags: string[];
}

const TasteTagList: React.FC<Props> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <View style={styles.tagContainer}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>#{tag}</Text>
        </View>
      ))}
    </View>
  );
};

export default TasteTagList;

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 127, 80, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#fff',
  },
});
