import { useApiService } from "../../../services/api/apiService";

interface UploadStoreInfoParams {
  formData: FormData;
  geocodeData: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    placeId: string;
    username: string;
  };
}

export const useUploadStoreInfo = () => {
  const { apiCall } = useApiService();

  const upload = async ({ formData, geocodeData }: UploadStoreInfoParams): Promise<string> => {
    // 1. 영상 + 정보 업로드 (apiCall, 토큰 자동)
    const storeId = await apiCall<string>({
      url: "store-info-upload",
      method: "POST",
      data: formData,
    });

    // 2. 지오코딩 정보 업로드 (apiCall, 토큰 자동)
    await apiCall({
      url: "geocoding-info-upload",
      method: "POST",
      data: { ...geocodeData, storeId },
    });

    return storeId;
  };

  return { upload };
};
