import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonLayout from '../../../../common/CommonLayout';
import { useApiService } from '../../../../services/api/apiService';

const EMAIL_DOMAINS = ['naver.com', 'daum.net', 'gmail.com', 'hanmail.net', 'kakao.com', 'nate.com', 'hotmail.com'];

const EmailRegister = ({ navigation }) => {
  const { apiCall } = useApiService();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 자동완성 추천 리스트 생성
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.includes('@')) {
      const [prefix, domain] = text.split('@');
      if (domain.length === 0) {
        setSuggestions(EMAIL_DOMAINS.map((d) => `${prefix}@${d}`));
      } else {
        setSuggestions(EMAIL_DOMAINS.filter((d) => d.startsWith(domain)).map((d) => `${prefix}@${d}`));
      }
    } else {
      setSuggestions([]);
    }
  };

  // 추천된 이메일 클릭 시 적용
  const handleSuggestionPress = (selectedEmail) => {
    setEmail(selectedEmail);
    setSuggestions([]); // 추천 목록 닫기
  };

  const handleRegisterEmail = async () => {
    if (!validateEmail(email)) {
      Alert.alert('오류', '유효한 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const username = await AsyncStorage.getItem('username');

      // 서버에서 이메일 중복 확인
      const checkResponse = await apiCall({
        method: 'POST',
        url: 'check-email',
        data: { email },
      });
      if(checkResponse){
        Alert.alert('알림', checkResponse);
        return false;
      }
      

      // 이메일 등록 요청
      const response = await apiCall({
        method: 'POST',
        url: 'update-email',
        data: { email, username },
      });

      if (response) {
        Alert.alert('성공', '이메일이 등록되었습니다.');
        navigation.goBack();
      } else {
        throw new Error(response || '이메일 등록 실패');
      }
    } catch (error) {
      console.error('이메일 등록 오류:', error);
      Alert.alert('오류', error.message || '이메일 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        {/* 이메일 입력 필드 + 등록 버튼 */}
        <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
          <TextInput
            style={styles.input}
            placeholder="이메일 입력"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TouchableOpacity onPress={handleRegisterEmail} disabled={loading}>
            <Text style={[styles.registerText, loading && styles.disabledText]}>
              {loading ? '등록 중...' : '등록'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 이메일 자동완성 추천 목록 */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1, // 입력 필드가 가능한 공간을 차지하게 함
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

  // 이메일 자동완성 스타일
  suggestionsContainer: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EmailRegister;
