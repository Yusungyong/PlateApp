import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LoginRequiredModal: React.FC<Props> = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const handleGoToLogin = () => {
    onClose();
    navigation.navigate('Login'); 
  };

  const handleCancel = () => {
    onClose();
    // navigation.goBack(); // ✅ 뒤로 가기 실행
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>로그인이 필요합니다</Text>
          <Text style={styles.message}>
            해당 기능은 로그인 후 이용하실 수 있어요.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoToLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>로그인 하러가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginRequiredModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#FF7F50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
