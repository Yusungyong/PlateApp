import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
} from 'react-native';

const FindAccountModal = ({ visible, onClose, onFindId, onFindPassword }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={modalStyles.overlay}>
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.title}>도움이 필요하신가요?</Text>
        <TouchableOpacity style={modalStyles.button} onPress={onFindId}>
          <Text style={modalStyles.buttonText}>아이디 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={modalStyles.button} onPress={onFindPassword}>
          <Text style={modalStyles.buttonText}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={modalStyles.close}>
          <Text style={modalStyles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 14,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FF7F50',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  close: {
    marginTop: 10,
    padding: 4,
  },
  closeText: {
    color: '#999',
    fontSize: 14,
  },
});
