import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../../config/config';

export const useVerifyCode = () => {
  const navigation = useNavigation();

  const verifyCode = async (username: string, email: string, verificationCode: string) => {
    if (!verificationCode) {
      Alert.alert("입력 오류", "인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, verificationCode }),
      });

      const responseText = await response.text();

      if (response.ok) {
        Alert.alert("알림", "인증 성공! 새 비밀번호를 설정하세요.");
        navigation.navigate('ResetPassword', { username, email }); // ✅ 인증 성공 시 이동
      } else {
        throw new Error(responseText);
      }
    } catch (error) {
      console.error("인증 코드 검증 실패:", error);
      Alert.alert("오류", error.message || "인증 코드가 유효하지 않습니다.");
    }
  };

  return { verifyCode };
};