// hooks/useSubmitReport.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useApiService } from '../../../services/api/apiService';

interface ReportPayload {
  reporterUsername: string;
  targetType: 'feed' | 'comment' | 'video' | 'user';
  targetId: number;
  reason: string;
  submittedAt: string;
}

export const useSubmitReport = () => {
  const { apiCall } = useApiService();

  const submitReport = useCallback(async (payload: ReportPayload) => {
    console.log(payload);
    try {
      await apiCall({
        method: 'POST',
        url: '/report', 
        data: payload,
      });
      Alert.alert('신고 완료', '신고가 성공적으로 접수되었습니다. 감사합니다.');
    } catch (error) {
      // 에러는 apiService에서 처리되므로 여기선 필요 없음
    }
  }, [apiCall]);

  return { submitReport };
};
