// ../UserOptions/RegActiveRegion.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerActiveRegion = async (region: string, apiCall: any) => {

  try {
    const username = await AsyncStorage.getItem("username");

    if (!username) {
      return;
    }

    const data = await apiCall({
      method: "POST",
      url: "/reg-active-region",
      data: {
        username,
        activeRegion: region,
      },
    });

  } catch (error) {
    console.error("❌ 등록 실패:", error.message);
  }
};
