// services/storage/secureStorage.ts
import * as Keychain from 'react-native-keychain';

type StoredValue = string | object;

export const secureStorage = {
  async setItem(key: string, value: StoredValue): Promise<void> {
    let newValue: string;

    if (typeof value === 'string') {
      newValue = value;
    } else {
      const existing = await this.getItem<object>(key);
      const merged = { ...(existing || {}), ...value };
      newValue = JSON.stringify(merged);
    }

    await Keychain.setGenericPassword(key, newValue, {
      service: key,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  async getItem<T = StoredValue>(key: string): Promise<T | null> {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (!credentials) return null;
    try {
      return JSON.parse(credentials.password) as T;
    } catch {
      return credentials.password as unknown as T;
    }
  },

  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },
};

export default secureStorage;

// ── 토큰 전용 헬퍼 추가 ─────────────────────────────────────────────

export type Tokens = {
  accessToken: string;
  refreshToken?: string;
  deviceId?: string;
  accessTokenExpiresAt?: string;   // ISO
  refreshTokenExpiresAt?: string;  // ISO
  username?: string;
  role?: string;
};

const TOKENS_KEY = 'tokens';

export const tokenStorage = {
  async get(): Promise<Tokens | null> {
    return await secureStorage.getItem<Tokens>(TOKENS_KEY);
  },
  async set(partial: Partial<Tokens>): Promise<void> {
    // 기존 값과 merge 저장
    await secureStorage.setItem(TOKENS_KEY, partial);
  },
  async clear(): Promise<void> {
    await secureStorage.removeItem(TOKENS_KEY);
  },
};
