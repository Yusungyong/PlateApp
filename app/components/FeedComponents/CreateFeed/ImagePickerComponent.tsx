import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

interface Props {
  images: string[];
  setImages: (images: string[]) => void;
}

const IMAGE_HEIGHT = 450;
const IMAGE_WIDTH = Dimensions.get('window').width - 16; // padding 고려

const ImagePickerComponent: React.FC<Props> = ({ images, setImages }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 앨범에서 이미지 선택
  const handleSelectImage = async () => {
    setModalVisible(false);
    setTimeout(async () => {
      try {
        const result = await ImagePicker.launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 20,
          presentationStyle: 'fullScreen', // 요걸 추가!
        });
        if (!result.assets) return;
        const uris = result.assets.map(asset => asset.uri || '');
        setImages(prev => [...prev, ...uris]);
      } catch (e) {
        // 예외처리 (Alert로 에러 안내도 OK)
      }
    }, 180);
  };

  const handleTakePhoto = async () => {
    setModalVisible(false);
    setTimeout(async () => {
      try {
        const result = await ImagePicker.launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: true,
          presentationStyle: 'fullScreen', // 요걸 추가!
        });
        if (!result.assets) return;
        const uris = result.assets.map(asset => asset.uri || '');
        setImages(prev => [...prev, ...uris]);
      } catch (e) {
        // 예외처리
      }
    }, 180);
  };

  // 이미지 삭제
  const handleRemoveImage = (uri: string) => {
    setImages(prev => prev.filter(img => img !== uri));
  };

  return (
    <View>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.simpleModalSheet}>
                <TouchableOpacity
                  style={styles.simpleModalButton}
                  onPress={handleSelectImage}
                  activeOpacity={0.7}
                >
                  <Text style={styles.simpleModalButtonText}>앨범에서 선택</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simpleModalButton}
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                >
                  <Text style={styles.simpleModalButtonText}>사진 촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.simpleModalButton, styles.simpleModalCancel]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.simpleModalButtonText, { color: '#999' }]}>취소</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {images.length === 0 ? (
        <ImageUploadBox onPress={() => setModalVisible(true)} />
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.imagePreviewContainer}>
          {images.map((uri, index) => (
            <ImagePreviewItem key={index} uri={uri} onRemove={() => handleRemoveImage(uri)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const ImageUploadBox = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
    <Text style={styles.plusIcon}>+</Text>
    <Text style={styles.selectorText}>이미지를 선택해주세요.</Text>
  </TouchableOpacity>
);

const ImagePreviewItem = ({ uri, onRemove }: { uri: string; onRemove: () => void }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri }} style={styles.selectedImage} resizeMode="cover" />
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={styles.removeButtonText}>✕</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  uploadBox: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    borderWidth: 1,
    borderColor: '#FF7F50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plusIcon: { fontSize: 40, color: '#FF7F50' },
  selectorText: { color: '#FF7F50', marginTop: 4, fontSize: 12 },
  imagePreviewContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  // 심플 모달 스타일
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)', // 더 연하게
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleModalSheet: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minWidth: 220,
    alignItems: 'center',
    elevation: 0, // 안드로이드 그림자 제거
    shadowOpacity: 0, // iOS 그림자 제거
  },
  simpleModalButton: {
    paddingVertical: 10,
    width: 170,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  simpleModalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  simpleModalCancel: {
    borderColor: '#EEE',
    backgroundColor: '#fafafa',
    marginTop: 0,
  },
});

export default ImagePickerComponent;
