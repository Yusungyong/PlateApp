import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiService } from "../../../../services/api/apiService";

const useGetActiveRegion = () => {
  const { apiCall } = useApiService();
  const [regionList, setRegionList] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosApiGetActiveRegion = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        setLoading(false);
        return;
      }

      const data = await apiCall({
        method: "GET",
        url: "/get-active-region",
      });

      // API 응답 데이터 설정
      setRegionList(data);
    } catch (error) {
      console.error("활동지역 등록 중 예외가 발생하였습니다:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axiosApiGetActiveRegion();
  }, []);

  return { regionList, loading };
};

export default useGetActiveRegion;