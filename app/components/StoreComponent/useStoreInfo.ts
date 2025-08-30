import { useCallback } from 'react';
import { useApiService } from '../../services/api/apiService';

export interface StoreInfoVO {
  id: number;
  address: string;
  username: string;
  storeName: string;
  type: 'video' | 'feed';
  thumbnail: string;
  createdAt: string;
  placeId: number;
}

export interface StoreListRequest {
  searchTxt?: string;
  page?: number;
  size?: number;
  includeCount?: boolean;
  userLatitude?: number;     // 🔹 이름 변경
  userLongitude?: number;     // 🔹 이름 변경
}

export interface StoreListResponse {
  list: StoreInfoVO[];
  totalCount: number;
}

export const useStoreInfo = () => {
  const { apiCall } = useApiService();

  const fetchStoreList = useCallback(
    async (requestBody: StoreListRequest): Promise<StoreListResponse> => {
      return apiCall<StoreListResponse>({
        url: '/store-list',
        method: 'POST',
        data: requestBody, // useLat/useLng가 포함된 requestBody
      });
    },
    [apiCall]
  );

  return {
    fetchStoreList,
  };
};
