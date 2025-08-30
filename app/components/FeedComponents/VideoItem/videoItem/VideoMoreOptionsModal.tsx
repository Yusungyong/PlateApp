import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import LoginRequiredModal from '../../../../auth/LoginRequiredModal';
import { useAuth } from '../../../../auth/AuthProvider';

interface Props {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onBlock: () => void;
  onShare?: () => void;
}

const VideoMoreOptionsModal: React.FC<Props> = ({
  visible,
  onClose,
  onReport,
  onBlock,
  onShare,
}) => {
  const { role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const handleProtectedAction = (action: () => void) => {
    if (isGuest) {
      onClose(); // ✅ 기존 모달 닫기
      setTimeout(() => setLoginModalVisible(true), 200); // ✅ 전환 타이밍 조절
    } else {
      onClose();
      action();
    }
  };


  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />

          <TouchableOpacity style={styles.option} onPress={() => handleProtectedAction(onReport)}>
            <Text style={styles.optionText}>신고하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handleProtectedAction(onBlock)}>
            <Text style={styles.optionText}>사용자 차단</Text>
          </TouchableOpacity>

          {onShare && (
            <TouchableOpacity style={styles.option} onPress={onShare}>
              <Text style={styles.optionText}>공유하기</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
});

export default VideoMoreOptionsModal;
