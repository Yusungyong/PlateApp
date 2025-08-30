import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface RenderButtonProps {
  iconName: string;
  text?: string; // 옵셔널로 변경 (또는 기본값을 지정)
  onPress: () => void;
  color?: string;
  count?: number | string;
}

export const renderButton = ({
  iconName,
  text = '',
  onPress,
  color = 'white',
  count,
}: RenderButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon name={iconName} size={36} color={color} />
    <Text style={styles.countText}>{count !== undefined ? count : text}</Text>
  </TouchableOpacity>
);


export const styles = StyleSheet.create({
  countText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    zIndex: 3,
  },
});
