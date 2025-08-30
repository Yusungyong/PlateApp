// components/PlateFeed/ExpandableText.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  text: string;
  expanded: boolean;
  onToggle: () => void;
  maxLength?: number;
}

const ExpandableText: React.FC<Props> = ({ text, expanded, onToggle, maxLength = 60 }) => {
  const shouldTruncate = text.length > maxLength;
  const displayText = !expanded && shouldTruncate ? text.slice(0, maxLength) + '...' : text;

  return (
    <TouchableOpacity onPress={shouldTruncate ? onToggle : undefined}>
      <Text style={styles.content}>{`"${displayText}"`}</Text>
      {shouldTruncate && (
        <Text style={styles.toggleText}>{expanded ? '접기 ▲' : '더보기 ▼'}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  content: {
    fontSize: 16,
    color: '#3E2723',
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 22,
  },
  toggleText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
