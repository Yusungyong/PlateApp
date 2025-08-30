import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../services/api/apiService';
import { useAuth } from '../../../../auth/AuthProvider';

const WithdrawalInfo = ({ navigation }) => {
  const { apiCall } = useApiService();
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { token, logout} = useAuth();

  const handleCancel = () => {
    navigation.goBack(); // 이전 화면으로 돌아가기
  };


  const handleProceed = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
  
      const response = await apiCall({
        method: 'POST',
        url: '/delete-user',
        data: { username },
      });
  
      if (response) {
        Alert.alert('회원탈퇴 완료', response, [
          { text: '확인', onPress: () => logout() },
        ]);
      } else {
        Alert.alert('탈퇴 실패', response || '회원탈퇴 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      if (error.response) {
      }
      Alert.alert('오류', '회원탈퇴 처리 중 문제가 발생했습니다.');
    } finally {
      setModalVisible(false);
      setPassword('');
    }
  };
  

  const openPasswordModal = () => {
    setModalVisible(true);
  };

  const closePasswordModal = () => {
    setModalVisible(false);
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원탈퇴 안내</Text>
      <Text style={styles.description}>
        회원탈퇴를 진행하면 사용자가 등록한 데이터 또는 친구관계, 좋아요 등 모든 데이터가 삭제됩니다. 정말로 진행하시겠습니까?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openPasswordModal}>
          <Text style={styles.proceedText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 비밀번호 입력 모달 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closePasswordModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={closePasswordModal}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProceed}>
                <Text style={styles.proceedText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  proceedText: {
    fontSize: 16,
    color: '#FF4D4F', // 탈퇴 강조
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default WithdrawalInfo;
