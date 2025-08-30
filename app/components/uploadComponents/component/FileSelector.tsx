import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Switch,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import Video from 'react-native-video';
import { createThumbnail } from 'react-native-create-thumbnail';
import { type FileSelectorProps } from './types';

const FileSelector: React.FC<FileSelectorProps> = ({
  file,
  thumbnail,
  isLoading,
  setFile,
  setThumbnail,
  setIsLoading,
  removeAudio,
  setRemoveAudio,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 결과 핸들러(앨범, 카메라 공통)
  const handleSelectResult = async (response: any) => {
    if (response.didCancel) {
      setIsLoading(false);
    } else if (response.errorCode) {
      console.error('비디오 선택 오류: ', response.errorMessage);
      setIsLoading(false);
    } else {
      const selectedFile: Asset | undefined = response.assets?.[0];
      if (!selectedFile) {
        setIsLoading(false);
        return;
      }
      setFile(selectedFile);

      try {
        const { path } = await createThumbnail({
          url: selectedFile.uri ?? '',
        });
        setThumbnail(path);
      } catch (error) {
        console.error('썸네일 생성 오류: ', error);
      }

      setIsLoading(false);
    }
  };

  // 앨범에서 동영상 선택
  const pickVideoFromLibrary = () => {
    setModalVisible(false);
    setIsLoading(true);
    setTimeout(() => {
      launchImageLibrary(
        { mediaType: 'video', presentationStyle: 'fullScreen' },
        handleSelectResult
      );
    }, 180);
  };

  const recordVideoFromCamera = () => {
    setModalVisible(false);
    setIsLoading(true);
    setTimeout(() => {
      launchCamera(
        { mediaType: 'video', presentationStyle: 'fullScreen' },
        handleSelectResult
      );
    }, 180);
  };

  // 🎯 file이 사라지면(즉, 화면 이동 또는 업로드 성공 후) -> Video 자동으로 언마운트
  useEffect(() => {
    return () => {
      // 언마운트시 cleanup (굳이 없어도 괜찮지만)
      // console.log('FileSelector unmounted!');
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#FF7F50" />;
  }

  return (
    <View style={styles.wrapper}>
      {/* 모달 */}
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
                  onPress={pickVideoFromLibrary}
                  activeOpacity={0.7}
                >
                  <Text style={styles.simpleModalButtonText}>앨범에서 선택</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.simpleModalButton}
                  onPress={recordVideoFromCamera}
                  activeOpacity={0.7}
                >
                  <Text style={styles.simpleModalButtonText}>동영상 촬영</Text>
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

      {file ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flex: 1 }}>
            <Video
              source={{ uri: file.uri }}
              style={styles.selectedVideo}
              resizeMode="cover"
              repeat
              paused={false}
              controls={false}
            />
          </TouchableOpacity>
          <View style={styles.audioToggleRow}>
            <Text style={styles.audioToggleLabel}>음소거 업로드</Text>
            <Switch
              value={removeAudio}
              onValueChange={setRemoveAudio}
              trackColor={{ false: '#ccc', true: '#FF7F50' }}
              thumbColor="#fff"
            />
          </View>
        </>
      ) : (
        <TouchableOpacity style={styles.uploadBox} onPress={() => setModalVisible(true)}>
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.selectorText}>동영상을 선택해주세요.</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 375 / 448,
    marginBottom: 8,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF7F50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 40,
    color: '#FF7F50',
  },
  selectorText: {
    color: '#FF7F50',
    marginTop: 4,
    fontSize: 12,
  },
  selectedVideo: {
    flex: 1,
    borderRadius: 8,
  },
  audioToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  audioToggleLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
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

export default FileSelector;
