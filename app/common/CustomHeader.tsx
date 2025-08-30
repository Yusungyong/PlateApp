import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 홈 화면에서는 헤더 안 보이도록 처리
  if (route.name === '홈') return null;

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconWrapper}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
      >
        <Icon name="chevron-back" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    width: 40,               // 터치 영역 제한
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 10,
  },
});

export default CustomHeader;
