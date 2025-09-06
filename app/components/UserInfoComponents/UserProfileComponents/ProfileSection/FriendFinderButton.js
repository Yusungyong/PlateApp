import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 변경

const FriendFinderButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      accessibilityLabel="친구 찾기"
      accessible
    >
      <Icon name="search-outline" size={20} color="#fff" style={styles.icon} />
      {/* ✅ Ionicons 검색 아이콘 */}
      <Text style={styles.text}>친구</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7F50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default FriendFinderButton;
