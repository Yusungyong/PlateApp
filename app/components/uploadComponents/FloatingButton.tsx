import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const FloatingButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.floatingButton} 
      onPress={() => navigation.navigate('CreatePost')}
    >
      <Icon name="edit" size={24} color="#FF7F50" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 12,
    // 그림자 효과 추가 (선택 사항)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default FloatingButton;
