// hooks/useBlockUser.ts
import { useApiService } from "../../../services/api/apiService";

export const useBlockUser = () => {
  const { apiCall } = useApiService();

  const blockUser = async ({
    blockerUsername,
    blockedUsername,
    blockedAt,
  }: {
    blockerUsername: string;
    blockedUsername: string;
    blockedAt: string;
  }) => {
    return await apiCall({
      method: 'POST',
      url: '/user-block',
      data: {
        blockerUsername,
        blockedUsername,
        blockedAt,
      },
    });
  };

  return { blockUser };
};
