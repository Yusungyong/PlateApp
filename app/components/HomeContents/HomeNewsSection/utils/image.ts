// utils/image.ts
import { Platform, PermissionsAndroid, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import type { ImageLibraryOptions } from 'react-native-image-picker';

export const uniqueId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const normalizeUri = (uri: string) => {
  if (!uri) return uri;
  return Platform.OS === 'ios' ? (uri.startsWith('file://') ? uri.replace('file://', '') : uri) : uri;
};

async function ensureAndroidGalleryPermission() {
  if (Platform.OS !== 'android') return true;
  const sdk = Number(Platform.Version); // 안드로이드 SDK
  const perm =
    sdk >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const has = await PermissionsAndroid.check(perm);
  if (has) return true;

  const res = await PermissionsAndroid.request(perm);
  return res === PermissionsAndroid.RESULTS.GRANTED;
}

export const pickImages = async (options?: Partial<ImageLibraryOptions>) => {
  // ✅ Android 권한 가드
  if (Platform.OS === 'android') {
    const ok = await ensureAndroidGalleryPermission();
    if (!ok) {
      const e = new Error('android_permission_denied');
      (e as any).code = 'android_permission_denied';
      throw e;
    }
  }

  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: options?.quality ?? 1,
    selectionLimit: options?.selectionLimit ?? 0,
    includeExtra: false,
  });

  // 라이브러리 자체 에러 핸들링
  if ((result as any).errorCode) {
    const e = new Error((result as any).errorMessage || (result as any).errorCode);
    (e as any).code = (result as any).errorCode;
    throw e;
  }

  if (result.didCancel) return [] as string[];

  const uris = (result.assets || [])
    .map(a => a.uri)
    .filter((u): u is string => !!u);

  return uris;
};

export const getAspectRatios = async (uris: string[]): Promise<number[]> => {
  if (!uris?.length) return [];
  const ratios: number[] = new Array(uris.length);

  await Promise.all(
    uris.map(
      (uri, idx) =>
        new Promise<void>((resolve) => {
          Image.getSize(
            uri,
            (w, h) => {
              ratios[idx] = w && h ? w / h : 1;
              resolve();
            },
            () => {
              ratios[idx] = 1;
              resolve();
            }
          );
        })
    )
  );
  return ratios;
};
