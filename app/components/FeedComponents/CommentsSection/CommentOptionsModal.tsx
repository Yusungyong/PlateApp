import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CommentOptionsModal = ({ visible, onClose, options = [] }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* 바깥 클릭 시 닫힘 */}
        <Pressable style={styles.backdropTouchable} onPress={onClose} />

        {/* 바텀 시트 */}
        <View style={styles.modalSheet}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalButton}
              onPress={() => {
                onClose();
                option.onPress();
              }}
              accessibilityRole="button"
            >
              <Text style={[styles.modalButtonText, option.destructive && styles.destructive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* 닫기 버튼 */}
          <TouchableOpacity
            style={[styles.modalButton, { marginTop: 10 }]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={[styles.modalButtonText, { color: '#999' }]}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
    
  },
  backdropTouchable: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#fff',
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    paddingBottom: 40,
  },
  modalButton: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#222',
  },
  destructive: {
    color: '#FF4D4F',
  },
});

export default CommentOptionsModal;
