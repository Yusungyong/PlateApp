import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomRadioButton = ({ label, value, selected, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(value)}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // 각 항목 사이에 10픽셀 간격 추가
    marginTop: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default CustomRadioButton;
