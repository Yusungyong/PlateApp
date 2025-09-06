import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useNavigation } from '@react-navigation/native';

const FloatingButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.floatingButton} 
      onPress={() => navigation.navigate('CreatePost')}
    >
      <Icon name="pencil-outline" size={24} color="#FF7F50" /> 
      {/* ✅ Ionicons 연필 아이콘 */}
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
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Android 그림자
  },
});

export default FloatingButton;
