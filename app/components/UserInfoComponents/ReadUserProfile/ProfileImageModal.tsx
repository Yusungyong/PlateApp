import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { profileBucket } from '../../../config/config';

export interface ProfileImageModalProps {
  visible: boolean;
  imageUrl?: string;
  onClose: () => void;
}

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({ visible, imageUrl, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {imageUrl ? (
              <FastImage
                source={{ uri: profileBucket + imageUrl }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Text style={styles.errorText}>이미지를 불러올 수 없습니다.</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '88%',
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.92)',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  image: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#222',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.34)',
    borderRadius: 18,
    padding: 3,
  },
  errorText: { color: 'red', fontSize: 16 },
});

export default ProfileImageModal;
