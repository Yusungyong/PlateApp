import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export type FeedAction = {
  label: string;
  onPress: () => void;
  danger?: boolean;
  icon?: string; // Ionicons 이름
};

interface Props {
  visible: boolean;
  onClose: () => void;
  actions?: FeedAction[]; // ✅ optional 처리
}

const FeedActionModal: React.FC<Props> = ({
  visible,
  onClose,
  actions = [], // ✅ 기본값 설정
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => {
              onClose(); // 먼저 닫고
              action.onPress(); // 그다음 실행
            }}
          >
            <View style={styles.optionRow}>
              {action.icon && (
                <Icon
                  name={action.icon}
                  size={18}
                  color={action.danger ? '#d00' : '#333'}
                  style={styles.optionIcon}
                />
              )}
              <Text style={[styles.optionText, action.danger && { color: '#d00' }]}>
                {action.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FeedActionModal;

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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
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
