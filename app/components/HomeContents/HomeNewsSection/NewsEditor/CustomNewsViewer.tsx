import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ImageBlock from '../components/ImageBlock';

interface Block {
  id: string;
  type: 'title' | 'text' | 'image';
  content?: string;
  uris?: string[];
  aspectRatios?: number[];
}

interface Props {
  mainContent: string | Block[];
  imageDisplayMode?: 'grid' | 'slide';
}

const screenWidth = Dimensions.get('window').width;

const CustomNewsViewer: React.FC<Props> = ({ mainContent, imageDisplayMode = 'slide' }) => {
  
  let blocks: Block[] = [];

  try {
    const parsed = typeof mainContent === 'string' ? JSON.parse(mainContent) : mainContent;

    if (Array.isArray(parsed)) {
      blocks = parsed;
    } else {
      console.warn('mainContent는 배열 형식이 아닙니다.');
      return <Text style={styles.errorText}>잘못된 콘텐츠 형식입니다.</Text>;
    }
  } catch (e) {
    console.warn('mainContent 파싱 실패', e);
    return <Text style={styles.errorText}>콘텐츠를 불러오는 중 오류가 발생했습니다.</Text>;
  }

  return (
    <View style={styles.viewer}>
      {blocks.map((block) => {
        if (block.type === 'image' && block.uris) {
          const validUris = block.uris.filter((uri) => uri && uri.trim() !== '');
          const ratio = block.aspectRatios?.[0] || 1.5;
          const imageHeight = screenWidth / ratio;

          return (
            <View key={block.id} style={{ width: screenWidth, marginBottom: 32 }}>
              <ImageBlock
                uris={validUris}
                aspectRatios={block.aspectRatios}
                mode={imageDisplayMode}
              />
            </View>
          );
        }

        return (
          <View key={block.id} style={styles.textBlock}>
            <Text style={block.type === 'title' ? styles.title : styles.text}>
              {block.content}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  viewer: {
    backgroundColor: '#fff',
    paddingTop: 82,
  },
  textBlock: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 28,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
});

export default CustomNewsViewer;
