import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const FindIdScreen = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFindId = async () => {
    if (!email.trim()) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }
    setSubmitting(true);

    try {
      // === 실제 서버 연동 예시 ===
      // const response = await findIdApi({ email });
      // if (response.success && response.username) {
      //   Alert.alert('아이디 찾기', `가입된 아이디: ${response.username}`);
      // } else {
      //   Alert.alert('아이디 찾기', '일치하는 계정을 찾을 수 없습니다.');
      // }

      // --- 샘플 로직(테스트용) ---
      if (email === 'user@email.com') {
        Alert.alert('아이디 찾기', '가입된 아이디는\n **user1234** 입니다.');
      } else {
        Alert.alert('아이디 찾기', '일치하는 계정을 찾을 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '아이디 찾기 중 문제가 발생했습니다.');
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>아이디 찾기</Text>
          <Text style={styles.subtitle}>
            가입 시 등록한 이메일 주소를 입력해 주세요.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!submitting}
            returnKeyType="done"
            onSubmitEditing={handleFindId}
          />
          <TouchableOpacity
            style={[styles.button, submitting && { backgroundColor: "#FFA07A" }]}
            onPress={handleFindId}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>이메일 인증</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    marginBottom: 32,
    color: '#333',
    paddingHorizontal: 6,
  },
  button: {
    backgroundColor: '#FF7F50',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FindIdScreen;
