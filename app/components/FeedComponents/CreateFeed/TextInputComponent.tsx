import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface TextInputComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: object;
  onBlur?: () => void;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
  onBlur,
}) => {
  return (
    <TextInput
      style={[styles.input, multiline && styles.textArea, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      onBlur={onBlur}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default TextInputComponent;
