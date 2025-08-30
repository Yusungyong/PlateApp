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

interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
  onSignUp: () => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, onSignUp }) => {
  const [showButton, setShowButton] = useState(false); // 버튼 표시 여부
  const buttonOpacity = useRef(new Animated.Value(0)).current; // 버튼 애니메이션 초기값
  const buttonScale = useRef(new Animated.Value(0)).current;

  const validateEmail = (value: string) => {
    setEmail(value);

    // 이메일 형식 유효성 검사 (정규식)
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(value);

    if (isValid) {
      // 버튼 표시 애니메이션
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
      setShowButton(true);
    } else {
      // 버튼 숨김 애니메이션
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setShowButton(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            showButton && { paddingRight: 100 }, // 버튼이 나타날 때 추가 여백
          ]}
          placeholder="이메일을 입력하세요"
          keyboardType="email-address"
          value={email}
          onChangeText={validateEmail}
          placeholderTextColor="#999"
        />
        {showButton && (
          <Animated.View
            style={[
              styles.button,
              {
                opacity: buttonOpacity,
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <TouchableOpacity onPress={onSignUp}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
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
    elevation: 4, // Android 그림자
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 20,
    color: '#333',
  },
  button: {
    position: 'absolute', // 버튼을 입력 필드 오른쪽에 고정
    right: 10,
    backgroundColor: '#FF7F50',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // 버튼에도 그림자 추가
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Android 그림자
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailInput;

