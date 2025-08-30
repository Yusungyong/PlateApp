import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import Video from 'react-native-video';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const ModalVideoPlayer = ({ isVisible, onClose, videoUrl }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isVisible) {
      translateY.setValue(0);
    }
  }, [isVisible]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: deviceHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120) {
        closeModal();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal visible={isVisible} transparent={false} animationType="fade">
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
        <Video
          source={{ uri: videoUrl }}
          style={styles.fullscreenVideo}
          resizeMode="contain"
          controls
        />
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: deviceWidth,
    height: deviceHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ModalVideoPlayer;
