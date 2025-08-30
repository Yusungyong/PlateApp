import { useApiService } from '../../../../services/api/apiService';

const useVisitFriend = () => {
  const { apiCall } = useApiService();

  const visitFriend = async ({ friendName, username }) => {
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/user-visit-friend',
        data: {
          friendName,
          username,
        },
      });

      return response;  // <- 응답값 그대로 리턴
    } catch (error) {
      console.error('visitFriend error:', error);
      return null;  // 실패시 null 반환
    }
  };

  return { visitFriend };
};

export default useVisitFriend;
