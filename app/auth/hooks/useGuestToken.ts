import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

interface GuestAuthInfo {
  token: string | null;
  username: string | null;
}

export const getGuestToken = async (): Promise<GuestAuthInfo> => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const res = await axios.post('https://foodplayserver.shop/auth/guest-token', {
      deviceId,
    });

    const token = res.data.token;
    const username = 'guest';

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, username };
    }

    return { token: null, username: null };
  } catch (error) {
    console.error('게스트 토큰 발급 실패:', error);
    return { token: null, username: null };
  }
};
