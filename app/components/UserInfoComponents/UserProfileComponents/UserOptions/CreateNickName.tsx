import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonLayout from '../../../../common/CommonLayout';
import { useApiService } from '../../../../services/api/apiService';


const CreateNickName = ({ navigation }) => {
  const [nickName, setNickName] = useState('');
  const { apiCall } = useApiService(); // apiService 사용
  const validateNickName = (name) => {
    const isValidLength = name.length >= 2 && name.length <= 20; // 공백 포함 길이 제한
    const isValidCharacters = /^[a-zA-Z0-9가-힣\s]+$/.test(name); // 공백(\s) 허용
    if (!isValidLength) {
      Alert.alert('오류', '닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return false;
    }
    if (!isValidCharacters) {
      Alert.alert('오류', '닉네임에는 한글, 영문, 숫자, 공백만 사용할 수 있습니다.');
      return false;
    }
    return true;
  };

  const handleSaveNickName = async () => {
    if (!nickName.trim()) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }
    if (!validateNickName(nickName)) {
      return;
    }
  
    try {
      
      const username = await AsyncStorage.getItem("username");
      const response = await apiCall({
        url: '/update-nickname',
        method: 'POST',
        data: {
          username, // 사용자의 username
          nickName, // 새 닉네임
        },
      });
      Alert.alert(response);
      navigation.goBack();
    } catch (error) {
      console.error('닉네임 저장 오류:', error);
      Alert.alert('오류', '닉네임을 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor="#999"
            value={nickName}
            onChangeText={setNickName}
            maxLength={20}
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveNickName}>
            <Text style={styles.buttonText}>등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CommonLayout>
  );
};

export default CreateNickName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 2, // 밑줄 추가
    borderBottomColor: '#FF7F50', // 밑줄 색상
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 10,
    borderWidth: 0, // 테두리 제거
  },
  button: {
    backgroundColor: '#fff', // 버튼 배경 흰색
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: '#FF7F50', // 버튼 테두리 색상
  },
  buttonText: {
    color: '#FF7F50', // 기존 버튼 배경색을 텍스트 색상으로 적용
    fontSize: 16,
    fontWeight: 'bold',
  },
});