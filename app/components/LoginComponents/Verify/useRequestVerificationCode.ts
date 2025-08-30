import { useState } from 'react';
import { Alert } from 'react-native';
import { apiUrl } from '../../../config/config';

export const useRequestVerificationCode = () => {
  const [loading, setLoading] = useState(false);

  const requestCode = async (username: string, email: string, onSuccess: () => void) => {
    if (!username || !email) {
      Alert.alert("입력 오류", "아이디와 이메일을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const responseText = await response.text();

      if (response.ok) {
        Alert.alert("알림", responseText);
        onSuccess(); // 성공 시 콜백 실행
      } else {
        throw new Error(responseText);
      }
    } catch (error) {
      console.error("비밀번호 찾기 요청 실패:", error);
      Alert.alert("오류", error.message || "요청을 처리할 수 없습니다. 다시 시도해주세요.");
    }

    setLoading(false);
  };

  return { requestCode, loading };
};