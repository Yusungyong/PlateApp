import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';

const CustomModal = forwardRef((_, ref) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: (msg) => {
      setMessage(msg);
      setVisible(true);
      Animated.timing(opacity, {
        toValue: 1, // 완전히 보이도록 설정
        duration: 300, // 열릴 때 애니메이션 시간
        useNativeDriver: true,
      }).start();

      setTimeout(() => closeModal(), 700); // 2초 후 자동 닫힘
    },
  }));

  const closeModal = () => {
    Animated.timing(opacity, {
      toValue: 0, // 투명하게 만들기
      duration: 800, // 닫힐 때 애니메이션 시간
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          styles.overlay,
          { opacity }, // 투명도 애니메이션 적용
        ]}
      >
        <Text style={styles.messageText}>{message}</Text>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CustomModal;
