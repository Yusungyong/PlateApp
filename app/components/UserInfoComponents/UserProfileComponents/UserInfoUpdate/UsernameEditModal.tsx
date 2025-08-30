import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useApiService } from '../../../../services/api/apiService';
import { codeUserNickNameApprochType } from '../../../../config/config';

const UsernameEditModal = ({ currentUsername, onClose, onSave }) => {
  const [options, setOptions] = useState([]); // 서버에서 가져온 리스트
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { apiCall } = useApiService(); // apiCall 사용 준비

  // 서버에서 사용자 이름 리스트 가져오기
  useEffect(() => {
    const fetchUsernameOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall({
          method: 'GET',
          url: 'code-selector', // API 엔드포인트
          params : { groupCode : codeUserNickNameApprochType}
        });

        setOptions(response); // 응답 데이터를 그대로 리스트로 사용
      } catch (err) {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsernameOptions();
  }, []);

  const handleSelect = async (selectedCodeEx) => {
    try {
      // POST 요청 보내기
      const response = await apiCall({
        method: 'POST',
        url: 'update-nickname-code', // POST 요청 엔드포인트
        data: {
          username: currentUsername, // 현재 사용자 이름
          code: selectedCodeEx, // 선택된 코드
        },
      });

      onClose();
    } catch (error) {
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item.code)} // 터치 시 선택
    >
      <Text style={styles.optionText}>{item.codeEx}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.modalContent}>
        <ActivityIndicator size="large" color="#FF7F50" />
        <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.modalContent}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.buttonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>계정 표출방식 선택</Text>
      <FlatList
        data={options}
        keyExtractor={(item, index) => `${item.codeEx}-${index}`}
        renderItem={renderOption}
        style={styles.optionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionList: {
    width: '100%',
  },
  optionItem: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#333',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF7F50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UsernameEditModal;