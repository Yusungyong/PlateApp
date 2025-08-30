import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  isSubmitting: boolean;
}

const SubmitButtonComponent: React.FC<SubmitButtonProps> = ({ onPress, isSubmitting }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isSubmitting}
      activeOpacity={0.7}
      style={[styles.button, isSubmitting && styles.buttonDisabled]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isSubmitting }}
      accessibilityLabel={isSubmitting ? '작성 중입니다' : '등록 버튼'}
    >
      {isSubmitting ? (
        <Text style={[styles.submitText, styles.submitTextDisabled]}>작성 중...</Text>
      ) : (
        <Image
          source={require('../../../../images/upload_button_icon.png')}
          style={styles.uploadButtonIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  submitTextDisabled: {
    opacity: 0.5,
  },
  uploadButtonIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default SubmitButtonComponent;
