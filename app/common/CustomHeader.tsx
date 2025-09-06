import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 홈 화면에서는 헤더 안 보이도록 처리
  if (route.name === '홈') return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconWrapper}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // ✅ 터치 여유
        >
          <Icon name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff', // 필요시 투명하게 가능
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,              // 불필요하게 크지 않게
    paddingHorizontal: 10,
  },
  iconWrapper: {
    width: 44,               // 터치 영역 확대
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader;
