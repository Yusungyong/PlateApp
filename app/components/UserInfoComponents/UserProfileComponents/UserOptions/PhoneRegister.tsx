import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonLayout from '../../../../common/CommonLayout';
import { useApiService } from '../../../../services/api/apiService';

const PhoneRegister = ({ navigation }) => {
  const { apiCall } = useApiService();
  // phone은 원시 숫자 문자열을 저장합니다.
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // onBlur 시 화면에 보여줄 포맷팅 함수
  const formatPhoneNumber = (digits) => {
    // 입력값은 오직 숫자만 포함한다고 가정합니다.
    if (digits.startsWith('010')) {
      if (digits.length >= 8) {
        return digits.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
      } else if (digits.length > 3) {
        return digits.replace(/(\d{3})(\d+)/, '$1-$2');
      }
    } else if (/^(02|0[3-6][1-4])/.test(digits)) {
      if (digits.length >= 8) {
        return digits.replace(/(\d{2,3})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
      } else if (digits.length > 2) {
        return digits.replace(/(\d{2,3})(\d+)/, '$1-$2');
      }
    }
    return digits;
  };

  // 원시 숫자에 대해 유효성 검사를 수행합니다.
  const validatePhoneDigits = (digits) => {
    if (digits.startsWith('010')) {
      return digits.length === 11;
    } else if (digits.startsWith('02')) {
      // 02 지역번호는 보통 9자리(02-XXX-XXXX) 또는 10자리(02-XXXX-XXXX)
      return digits.length === 9 || digits.length === 10;
    } else if (/^0[3-6][1-4]/.test(digits)) {
      return digits.length === 10 || digits.length === 11;
    }
    return false;
  };

  // 사용자가 입력할 때는 원시 숫자 문자열만 업데이트
  const handlePhoneChange = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    setPhone(digits);
    const valid = validatePhoneDigits(digits);
    setIsValid(valid);
    // 길이가 충분한데 유효하지 않으면 오류 메시지 설정
    if (!valid && (digits.length === 10 || digits.length === 11)) {
      setPhoneError('전화번호 형식이 올바르지 않습니다.');
    } else {
      setPhoneError('');
    }
  };

  // 입력창에 포커스가 될 때 포맷팅을 제거하여 수정이 용이하게 함
  const handleFocus = () => {
    setIsFocused(true);
    // 포맷팅 문자가 있다면 제거
    setPhone(phone.replace(/[^0-9]/g, ''));
  };

  // 입력창에서 포커스가 벗어나면 포맷팅을 적용
  const handleBlur = () => {
    setIsFocused(false);
    setPhone(formatPhoneNumber(phone));
  };

  const handleRegisterPhone = async () => {
    if (!isValid) {
      Alert.alert('오류', '유효한 연락처를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('오류', '사용자 정보가 없습니다. 다시 로그인 해주세요.');
        setLoading(false);
        return;
      }
      // 서버로 보낼 때는 하이픈 제거
      const phoneDigits = phone.replace(/-/g, '');
      const response = await apiCall({
        method: 'POST',
        url: 'update-phone',
        data: { phone: phoneDigits, username },
      });
        Alert.alert('성공', `${response}`);
        navigation.goBack();
    } catch (error) {
      console.error('연락처 등록 오류:', error);
      Alert.alert('오류', '연락처 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
          <TextInput
            style={styles.input}
            placeholder="연락처 입력"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            // 포커스 중일 때는 원시 숫자, 포커스 아웃 시 포맷팅된 값이 보입니다.
            value={phone}
            onChangeText={handlePhoneChange}
            autoCapitalize="none"
            maxLength={11} // 숫자만 입력 (예: 01012345678)
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <TouchableOpacity onPress={handleRegisterPhone} disabled={!isValid || loading}>
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator size="small" color="#FF7F50" />
              ) : (
                <Text style={[styles.registerText, (!isValid || loading) && styles.disabledText]}>
                  등록
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        {phoneError !== '' && (
          <Text style={styles.errorText}>{phoneError}</Text>
        )}
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    justifyContent: 'center' 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  inputFocused: {
    borderBottomColor: '#FF7F50',
  },
  registerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7F50',
    marginLeft: 10,
    marginRight: 10,
  },
  disabledText: {
    color: '#aaa',
  },
  errorText: {
    marginTop: 8,
    color: 'red',
    fontSize: 14,
  },
  buttonContent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default PhoneRegister;
