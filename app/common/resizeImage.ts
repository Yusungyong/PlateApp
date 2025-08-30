import { Image } from 'react-native';
import ImageResizer from 'react-native-image-resizer';

/**
 * 이미지 최적화 함수 (원본 해상도를 유지하면서 품질만 낮춤)
 * @param uri 원본 이미지 URI
 * @param quality JPEG 품질 (0~100, 기본값: 70)
 * @returns 압축된 이미지 URI
 */
export const resizeImage = async (uri: string, quality: number = 70): Promise<string> => {
  try {
    console.log('resizeImage 호출됨.');

    // 🔹 원본 이미지 크기 가져오기
    const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      Image.getSize(
        uri,
        (w, h) => resolve({ width: w, height: h }),
        (error) => reject(error)
      );
    });

    console.log(`📏 원본 해상도: ${width} x ${height}`);

    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      width, // 원본 해상도 유지
      height, // 원본 해상도 유지
      'JPEG', // JPEG 포맷으로 변환 (용량 감소 효과)
      quality, // 품질 조절 (낮을수록 파일 크기가 작아짐)
      0 // 회전 없음
    );

    console.log(`✅ 압축된 이미지: ${resizedImage.uri}`);
    console.log(`📏 압축 후 크기: ${resizedImage.size} bytes`);

    return resizedImage.uri;
  } catch (error) {
    console.error('❌ 이미지 압축 오류:', error);
    return uri; // 오류 발생 시 원본 URI 반환
  }
};
