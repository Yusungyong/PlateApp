import { useEffect } from 'react';
import { Image } from 'react-native';

export const useImageDimensions = (
  images: string[],
  imageDimensions: { [key: string]: { width: number; height: number } },
  setImageDimensions: React.Dispatch<React.SetStateAction<{ [key: string]: { width: number; height: number } }>>,
) => {
  useEffect(() => {
    images.forEach(uri => {
      if (!imageDimensions[uri]) {
        Image.getSize(
          uri,
          (width, height) => {
            const fixedHeight = 450;
            const computedWidth = (width / height) * fixedHeight;
            setImageDimensions(prev => ({
              ...prev,
              [uri]: { width: computedWidth, height: fixedHeight },
            }));
          },
          () => {
            setImageDimensions(prev => ({
              ...prev,
              [uri]: { width: 200, height: 450 },
            }));
          }
        );
      }
    });
  }, [images]);
};
