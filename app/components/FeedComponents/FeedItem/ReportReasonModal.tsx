import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const reasons = [
  '욕설 및 비방',
  '음란/불쾌한 콘텐츠',
  '스팸 또는 광고',
  '앱과 관련되지 않은 콘텐츠',
  '기타',
];

const ReportReasonModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState<string>('');

  const isCustom = selectedReason === '기타';

  const handleSelect = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== '기타') {
      setCustomReason('');
    }
  };

  const handleSubmit = () => {
    if (selectedReason) {
      const finalReason = isCustom ? customReason.trim() : selectedReason;
      if (finalReason) {
        onSubmit(finalReason);
        setSelectedReason(null);
        setCustomReason('');
      }
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <View />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>신고 사유를 선택해주세요</Text>

          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={styles.reasonRow}
              onPress={() => handleSelect(reason)}
            >
              <View style={styles.radio}>
                {selectedReason === reason && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}

          {isCustom && (
            <TextInput
              style={styles.input}
              placeholder="신고 사유를 입력해주세요"
              value={customReason}
              onChangeText={setCustomReason}
              autoFocus
              multiline
            />
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  selectedReason &&
                  (!isCustom || (isCustom && customReason.trim() !== ''))
                    ? '#E74C3C'
                    : '#ccc',
              },
            ]}
            onPress={handleSubmit}
            disabled={
              !selectedReason || (isCustom && customReason.trim() === '')
            }
          >
            <Text style={styles.submitText}>신고 제출</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelText}>닫기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  keyboardAvoiding: {
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalContainer: {
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E74C3C',
  },
  input: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#333',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#888',
  },
});

export default ReportReasonModal;
