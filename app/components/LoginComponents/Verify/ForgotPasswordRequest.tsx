import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRequestVerificationCode } from './useRequestVerificationCode';
import { useVerifyCode } from './useVerifyCode';

const ForgotPasswordRequest: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [timer, setTimer] = useState(600); // 10분 (600초)

  const { requestCode, loading } = useRequestVerificationCode();
  const { verifyCode } = useVerifyCode();

  // ⏳ 제한시간 카운트다운
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerificationInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showVerificationInput, timer]);

  // 남은 시간 포맷 (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>비밀번호 찾기</Text>

          {/* 아이디 & 이메일 입력 */}
          {!showVerificationInput && (
            <>
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
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => requestCode(username, email, () => {
                  setShowVerificationInput(true);
                  setTimer(600);
                })}
                disabled={loading}
              >
                <Text style={styles.requestButtonText}>
                  {loading ? "요청 중..." : "인증 코드 요청"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* 인증 코드 입력 */}
          {showVerificationInput && (
            <>
              <Text style={styles.timerText}>남은 시간: {formatTime(timer)}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>인증 코드</Text>
                <TextInput
                  style={styles.input}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder="인증 코드를 입력하세요"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={[styles.requestButton, timer === 0 && { backgroundColor: '#ddd' }]}
                onPress={() => verifyCode(username, email, verificationCode)}
                disabled={timer === 0}
              >
                <Text style={styles.requestButtonText}>인증 코드 확인</Text>
              </TouchableOpacity>

              {/* 타이머 종료 시, 재요청 버튼 표시 */}
              {timer === 0 && (
                <TouchableOpacity style={styles.resendButton} onPress={() => requestCode(username, email, () => setTimer(600))}>
                  <Text style={styles.resendButtonText}>인증 코드 재요청</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    formContainer: { width: '100%' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24, textAlign: 'center' },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: '#333', marginBottom: 8 },
    input: { height: 48, borderBottomWidth: 1, borderBottomColor: '#ddd', fontSize: 16, color: '#333' },
    requestButton: { backgroundColor: '#FF7F50', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    requestButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    timerText: { fontSize: 16, color: 'red', textAlign: 'center', marginVertical: 10 },
    resendButton: { marginTop: 12, alignItems: 'center' },
    resendButtonText: { color: '#FF7F50', fontSize: 14, fontWeight: 'bold' },
  });
  
export default ForgotPasswordRequest;