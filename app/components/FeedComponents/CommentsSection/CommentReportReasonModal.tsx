import React from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const reasons = [
  '스팸 또는 광고',
  '혐오 발언 또는 괴롭힘',
  '부적절한 콘텐츠',
  '기타',
];

const CommentReportReasonModal = ({
  visible,
  selectedReason,
  setSelectedReason,
  inputText,
  setInputText,
  onClose,
  onSubmit,
}) => {
  const handleReasonPress = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== '기타') setInputText('');
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContainer}
            >
              <View style={styles.header}>
                <Text style={styles.title}>신고 사유 선택</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={styles.radioRow}
                  onPress={() => handleReasonPress(reason)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selectedReason === reason && styles.radioOuterActive,
                    ]}
                  >
                    {selectedReason === reason && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{reason}</Text>
                </TouchableOpacity>
              ))}

              {selectedReason === '기타' && (
                <TextInput
                  placeholder="신고 사유를 입력해주세요"
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
              )}

              <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                <Text style={styles.submitButtonText}>제출하기</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: '#000', // 검정 테마
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000', // 검정 테마
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CommentReportReasonModal;
