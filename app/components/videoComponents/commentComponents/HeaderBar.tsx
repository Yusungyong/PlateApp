import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface HeaderBarProps {
  onPress: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.header} hitSlop={{ top: 30, bottom: 30, left: 10, right: 10 }}>
      <View style={styles.headerBar} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
});

export default HeaderBar;
