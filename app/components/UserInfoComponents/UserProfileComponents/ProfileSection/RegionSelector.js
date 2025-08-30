import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DEFAULT_REGION = '활동지역을 등록해주세요.';

const RegionSelector = ({ region, onPress, isDark }) => {
  const isDefault = region === DEFAULT_REGION;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.rowItem}
        onPress={onPress}
        accessibilityLabel="활동 지역 선택"
        accessible
      >
        <Icon name="map-marker" size={20} color="#FF7F50" />
        <Text
          style={[
            styles.text,
            {
              color: isDefault ? '#FF7F50' : isDark ? '#aaa' : '#666',
              fontWeight: isDefault ? 'bold' : 'normal',
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {region}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    marginLeft: 5,
  },
});

export default RegionSelector;
