import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface PasswordInputProps {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onNext: () => void;
  passwordRules?: {
    minLength?: number;
    requireSpecialChar?: boolean;  // ← 여기서 Uppercase 완전 제거!
  };
  buttonText?: string;
  onPasswordValid?: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onNext,
  passwordRules = { minLength: 8, requireSpecialChar: true }, // ← Uppercase 제거!
  buttonText = "다음",
  onPasswordValid,
}) => {
  const [showPasswordInput, setShowPasswordInput] = useState(true);
  const [showConfirmInput, setShowConfirmInput] = useState(false);
  const [hideFirstInput, setHideFirstInput] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isSpecialCharValid, setIsSpecialCharValid] = useState(false); // ← Uppercase 제거!

  const combinedTranslateY = useRef(new Animated.Value(0)).current;
  const confirmInputOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const validatePassword = (value: string) => {
    setPassword(value);

    const lengthValid = value.length >= (passwordRules.minLength || 8);
    const specialCharValid = passwordRules.requireSpecialChar
      ? /[!@#$%^&*(),.?":{}|<>]/.test(value)
      : true;

    setIsLengthValid(lengthValid);
    setIsSpecialCharValid(specialCharValid);

    // 모든 조건이 true일 때 진행
    if (lengthValid && specialCharValid) {
      setShowPasswordInput(false);
      setShowConfirmInput(true);
      onPasswordValid && onPasswordValid();

      Animated.timing(confirmInputOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const validateConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    if (password === value) {
      setShowButton(true);

      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      setShowButton(false);
      buttonOpacity.setValue(0);
    }
  };

  const handleFocusConfirmInput = () => {
    Animated.timing(combinedTranslateY, {
      toValue: -150,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setHideFirstInput(true);
    });
  };

  return (
    <View style={styles.container}>
      {!hideFirstInput && (
        <Animated.View
          style={[
            styles.checkAndInputContainer,
            { transform: [{ translateY: combinedTranslateY }] },
          ]}
        >
          <View style={styles.conditions}>
            {passwordRules.minLength && (
              <View style={styles.conditionItem}>
                <Icon name="check-circle" size={24} color={isLengthValid ? '#FF8C00' : '#ccc'} />
                <Text style={styles.conditionText}>
                  비밀번호는 {passwordRules.minLength}자 이상이어야 합니다.
                </Text>
              </View>
            )}
            {passwordRules.requireSpecialChar && (
              <View style={styles.conditionItem}>
                <Icon name="check-circle" size={24} color={isSpecialCharValid ? '#FF8C00' : '#ccc'} />
                <Text style={styles.conditionText}>비밀번호에는 특수문자가 포함되어야 합니다.</Text>
              </View>
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              value={password}
              onChangeText={validatePassword}
              placeholderTextColor="#999"
            />
          </View>
        </Animated.View>
      )}
      {showConfirmInput && (
        <Animated.View
          style={[
            styles.inputWrapper,
            { opacity: confirmInputOpacity, transform: [{ scale: confirmInputOpacity }] },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            secureTextEntry
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
            placeholderTextColor="#999"
            onFocus={handleFocusConfirmInput}
          />
          {showButton && (
            <Animated.View style={[styles.smallButton, { opacity: buttonOpacity }]}>
              <TouchableOpacity onPress={onNext}>
                <Text style={styles.smallButtonText}>{buttonText}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  checkAndInputContainer: { marginBottom: 20 },
  conditions: { marginBottom: 10 },
  conditionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  conditionText: { marginLeft: 10, fontSize: 14, color: '#333' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 20, color: '#333' },
  smallButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default PasswordInput;
