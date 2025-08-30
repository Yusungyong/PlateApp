import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSave?: () => void; // ✅ 동영상 저장용 옵션
}

const VideoActionModal: React.FC<Props> = ({ visible, onClose, onDelete, onSave }) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modalContainer}>
        {/* 저장하기 (선택사항) */}
        {onSave && (
          <TouchableOpacity style={styles.optionButton} onPress={onSave}>
            <Text style={styles.optionText}>저장하기</Text>
          </TouchableOpacity>
        )}

        {/* 삭제하기 */}
        {onDelete && (
          <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
            <Text style={[styles.optionText, { color: '#d00' }]}>삭제하기</Text>
          </TouchableOpacity>
        )}

        {/* 취소 */}
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default VideoActionModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingBottom: 32,
    paddingTop: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  optionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  cancelButton: {
    padding: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
