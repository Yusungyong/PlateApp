// appComponents/useSaveFcmToken.ts
import { useCallback } from 'react';
import { useApiService } from '../../services/api/apiService';

type SaveFcmTokenPayload = {
  username: string;
  fcmToken: string;
};

type SaveFcmTokenResponse = {
  success: boolean;
  message?: string;
  [k: string]: any;
};

export const useSaveFcmToken = () => {
  const { apiCall } = useApiService();

  // apiCall 아이덴티티가 안정적이므로 saveFcmToken도 안정적으로 유지됨
  const saveFcmToken = useCallback(
    async ({ username, fcmToken }: SaveFcmTokenPayload): Promise<SaveFcmTokenResponse> => {
      if (!username || !fcmToken) {
        throw new Error('Username and FCM token are required');
      }
      const response = await apiCall<SaveFcmTokenResponse>({
        method: 'POST',
        url: 'user-fcm-save',
        data: { username, fcmToken },
      });
      if (!response?.success) {
        console.warn('⚠️ FCM 토큰 저장 실패:', response?.message);
      }
      return response;
    },
    [apiCall],
  );

  return { saveFcmToken };
};
