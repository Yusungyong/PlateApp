import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import PasswordInput from '../SignUpComponents/PasswordInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiUrl } from '../../../config/config';

const ResetPassword: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, email } = route.params as { username: string; email: string };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('입력 오류', '비밀번호를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: password }),
      });

      const responseText = await response.text();

      if (response.ok) {
        Alert.alert('알림', '비밀번호가 성공적으로 변경되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        throw new Error(responseText);
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      Alert.alert('오류', error.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>새 비밀번호 설정</Text>
        <PasswordInput
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onNext={handleResetPassword}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24, textAlign: 'center' },
});

export default ResetPassword;