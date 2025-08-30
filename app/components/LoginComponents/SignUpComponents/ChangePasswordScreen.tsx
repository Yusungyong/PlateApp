import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CommonLayout from '../../../common/CommonLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordInput from './PasswordInput';
import { useApiService } from '../../../services/api/apiService';

const ChangePasswordScreen = ({ navigation }) => {
  const { apiCall } = useApiService();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);

  // ✅ 기존 비밀번호 검증
  const handleNext = async () => {
    if (!oldPassword) {
      Alert.alert('입력 오류', '기존 비밀번호를 입력해주세요.');
      return;
    }
  
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('로그인 정보가 없습니다.');
  
      const response = await apiCall({
        method: 'POST',
        url: 'verify-password',
        data: {
          username,
          password: oldPassword,
        },
      });
  
      if (response.success) {
        setShowNewPasswordInput(true);
      } else {
        Alert.alert('인증 실패', response.message || '비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 검증 요청 실패:', error);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };
  

  // ✅ 최종 비밀번호 변경
  const handleChangePassword = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('로그인 정보가 없습니다.');

      await apiCall({
        method: 'POST',
        url: 'update-password',
        data: {
          username,
          oldPassword,
          password: newPassword, // 🔑 서버는 'password'로 받음
        },
      });

      Alert.alert('성공', '비밀번호가 변경되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      Alert.alert('오류', error?.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.header}>비밀번호 변경</Text>

        {!showNewPasswordInput ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>기존 비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="기존 비밀번호를 입력하세요"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
          </>
        ) : (
          <PasswordInput
            password={newPassword}
            confirmPassword={confirmPassword}
            setPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            onNext={handleChangePassword}
            buttonText="비밀번호 변경"
          />
        )}
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    marginTop: 120,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 13,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
