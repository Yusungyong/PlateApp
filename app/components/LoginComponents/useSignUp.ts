import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/config';
import { Alert } from 'react-native';

interface SignUpForm {
  username: string;
  password: string;
  email: string;
}

interface SignUpValidation {
  isUsernameValid: boolean;
  isPasswordValid: boolean;
  isEmailValid: boolean;
  isFormValid: boolean;
}

interface SignUpResponse {
  success: boolean;
  message: string;
  field?: 'username' | 'password' | 'email';
}

export const useSignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    username: '',
    password: '',
    email: '',
  });

  const [validation, setValidation] = useState<SignUpValidation>({
    isUsernameValid: false,
    isPasswordValid: false,
    isEmailValid: false,
    isFormValid: false,
  });

  const [response, setResponse] = useState<SignUpResponse | null>(null);

  const validateUsername = (username: string) => {
    return username.length >= 4;
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasSpecialChar;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const isUsernameValid = validateUsername(form.username);
    const isPasswordValid = validatePassword(form.password);
    const isEmailValid = validateEmail(form.email);
    const isFormValid = isUsernameValid && isPasswordValid && isEmailValid;

    setValidation({
      isUsernameValid,
      isPasswordValid,
      isEmailValid,
      isFormValid,
    });

    setResponse(null); // 새 입력이 있으면 이전 응답을 초기화합니다.
  }, [form]);

  const setField = (field: keyof SignUpForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (navigation: any) => {
    if (validation.isFormValid) {
      try {
        const response = await axios.post<SignUpResponse>(`${apiUrl}signup`, form, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const responseData = response.data;
  
        if (responseData === "중복 된 아이디 입니다.") {
          Alert.alert('오류', '중복된 아이디입니다. 다른 아이디를 사용해주세요.');
          return false;
        } else if (responseData === "이미 가입 된 이메일 주소입니다.") {
          Alert.alert('오류', '이미 가입된 이메일 주소입니다. 다른 이메일을 사용해주세요.');
          return false;
        } else {
          // 회원가입이 완료된 후 다른 화면으로 이동 (예: 로그인 페이지로)
          navigation.navigate('Login'); // 로그인 화면으로 이동
          return true;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
          Alert.alert('오류', errorMessage);
        } else if (error.request) {
          Alert.alert('오류', '서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
        }
        return false;
      }
    } else {
      Alert.alert('오류', '모든 필드를 올바르게 입력해주세요.');
      return false;
    }
  };

  return {
    form,
    setField,
    validation,
    handleSignUp,
    response,
  };
};
