import React, { useState, useRef } from 'react';
import axios from 'axios';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { apiUrl } from '../../../config/config';

interface UsernameInputProps {
  username: string;
  setUsername: (value: string) => void;
  onNext: () => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ username, setUsername, onNext }) => {
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false); // API 요청 중 상태
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  const validateUsername = (value: string) => {
    if (value.length < 6) {
      setError('아이디는 6자 이상이어야 합니다.');
      animateButton(false);
      return false;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
      setError('아이디는 알파벳으로 시작하고 숫자만 포함할 수 있습니다.');
      animateButton(false);
      return false;
    }
    setError(null);
    animateButton(true);
    return true;
  };

  const handleChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const handleNext = async () => {
    if (!validateUsername(username)) {
      return;
    }

    setIsChecking(true);
    try {
      const response = await axios.get(`${apiUrl}signUpIdCheck?checkId=${username}`);
      if (response.data === 'N') {
        onNext();
      } else {
        setError(response.data.message || '사용중인 아이디입니다.');
      }
    } catch (err) {
      setError('서버와의 통신에 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsChecking(false);
    }
  };

  const animateButton = (show: boolean) => {
    if (show) {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="사용할 아이디를 입력하세요"
          value={username}
          onChangeText={handleChange}
          placeholderTextColor="#999"
        />
        <Animated.View
          style={[
            styles.button,
            {
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <TouchableOpacity onPress={handleNext} disabled={isChecking}>
            <Text style={styles.buttonText}>
              {isChecking ? '확인 중...' : '다음'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF7F50',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
});

export default UsernameInput;
