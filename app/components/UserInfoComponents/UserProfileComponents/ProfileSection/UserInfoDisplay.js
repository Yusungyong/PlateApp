import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserInfoDisplay = ({ displayName, onMenuPress, isDark }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text
          style={[styles.username, { color: isDark ? '#eee' : '#333' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        accessibilityLabel="메뉴 열기"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="dots-horizontal" size={24} color={isDark ? '#ccc' : '#666'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 32,
  },
  nameContainer: {
    flex: 1,
    marginRight: 4,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserInfoDisplay;
