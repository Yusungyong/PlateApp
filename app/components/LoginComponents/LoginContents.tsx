import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../auth/AuthProvider';
import { useLogin } from './useLogin';
import { getGuestToken } from '../../auth/hooks/useGuestToken';
import secureStorage from '../../services/storage/secureStorage';

const LoginContents: React.FC<{ onLoginSuccess: (token: string) => void }> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const navigation = useNavigation();

  // 콜백이 (token, refreshToken) 두 개 받도록!
  const { username, setUsername, password, setPassword, handleLogin } = useLogin(
    async (token: string, refreshToken: string) => {
      await login(token, refreshToken); // 둘 다 넘김!
      navigation.navigate('홈');
      onLoginSuccess(token);
    }
  );

  // Android 물리적 백버튼 차단 (최신 방식)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // 최신 React Native에서는 removeEventListener가 아니라, 구독 객체의 remove() 호출!
      return () => subscription.remove();
    }, [])
  );

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordRequest');
  };

  const handleGuestAccess = async () => {
    try {
      const { token, username } = await getGuestToken();
      if (token && username) {
        // 게스트 로그인에서는 refreshToken을 undefined로 넘김!
        await secureStorage.setItem('tokens', { accessToken: token });
        await AsyncStorage.setItem('username', username);
        await login(token, undefined); // refreshToken 없이 호출
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: '홈' }],
          })
        );
        onLoginSuccess(token);
      } else {
        Alert.alert('오류', '비회원 인증에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('비회원 인증 오류:', error);
      Alert.alert('오류', '비회원 인증 중 문제가 발생했습니다.');
    }
  };

  // 모달 상태 및 콜백
  const [findAccountVisible, setFindAccountVisible] = useState(false);

  const handleFindId = () => {
    setFindAccountVisible(false);
    navigation.navigate('FindIdScreen');
  };
  const handleFindPassword = () => {
    setFindAccountVisible(false);
    handleForgotPassword();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.loginContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="아이디를 입력하세요"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => setFindAccountVisible(true)}
          >
            <Text style={styles.forgotPasswordText}>아이디 / 비밀번호 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>
              계정이 없으신가요? <Text style={styles.signupButtonTextBold}>회원가입</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
            <Text style={styles.guestButtonText}>비회원으로 이용하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <FindAccountModal
        visible={findAccountVisible}
        onClose={() => setFindAccountVisible(false)}
        onFindId={handleFindId}
        onFindPassword={handleFindPassword}
      />
    </SafeAreaView>
  );
};

const FindAccountModal = ({ visible, onClose, onFindId, onFindPassword }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={modalStyles.overlay}>
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.title}>도움이 필요하신가요?</Text>
        <TouchableOpacity style={modalStyles.button} onPress={onFindId}>
          <Text style={modalStyles.buttonText}>아이디 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={modalStyles.button} onPress={onFindPassword}>
          <Text style={modalStyles.buttonText}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={modalStyles.close}>
          <Text style={modalStyles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 14,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#FF7F50',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  close: {
    marginTop: 10,
    padding: 4,
  },
  closeText: {
    color: '#999',
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF7F50',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#FF7F50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#666',
    fontSize: 14,
  },
  signupButtonTextBold: {
    fontWeight: 'bold',
    color: '#FF7F50',
  },
  guestButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
});

export default LoginContents;
