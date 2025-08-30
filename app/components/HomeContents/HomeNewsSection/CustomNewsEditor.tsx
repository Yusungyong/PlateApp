import React, { useMemo, useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import BlockList from './components/BlockList';
import EditorToolbar from './components/EditorToolbar';
import PreviewModal from './components/PreviewModal';
import { useNavigation } from '@react-navigation/native';
import { getAspectRatios, pickImages, uniqueId, normalizeUri } from './utils/image';
import { getImageBlocks, getTextBlocks, getTitleBlock, isValidToSave } from './utils/validation';
import { HOME_SCREEN_NAME, MAX_IMAGES_PER_PICK } from './constants';
import type { BlocksState } from './types';
import { useApiService } from '../../../services/api/apiService';
import { useAuth } from '../../../auth/AuthProvider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomNewsEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<BlocksState>([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const { apiCall } = useApiService();
  const { username } = useAuth();
  const navigation = useNavigation<any>();

  const insets = useSafeAreaInsets();
  const saveDisabled = useMemo(() => !isValidToSave(blocks), [blocks]);

  const addImageBlock = async () => {
    try {
      const uris = await pickImages({ selectionLimit: MAX_IMAGES_PER_PICK });
      if (!uris.length) return;
      const aspectRatios = await getAspectRatios(uris);
      setBlocks((prev) => [...prev, { id: uniqueId(), type: 'image', uris, aspectRatios }]);
    } catch (e: any) {
      if (e?.code === 'android_permission_denied')
        Alert.alert('권한 필요', '갤러리 접근 권한을 허용해주세요. 설정 > 앱 > 권한에서 변경할 수 있어요.');
      else Alert.alert('이미지 선택 실패', e?.message || '이미지를 불러오지 못했습니다.');
    }
  };

  const addTextBlock = () => setBlocks((prev) => [...prev, { id: uniqueId(), type: 'text', content: '' }]);
  const addTitleBlock = () => setBlocks((prev) => [...prev, { id: uniqueId(), type: 'title', content: '' }]);

  const updateContent = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && (b.type === 'title' || b.type === 'text') ? { ...b, content } : b))
    );
  };

  // 이미지 삭제/재배치 반영
  const updateImages = (id: string, nextUris: string[], nextRatios?: number[]) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && b.type === 'image' ? { ...b, uris: nextUris, aspectRatios: nextRatios } : b))
    );
  };

  const deleteBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  const saveContent = async () => {
    try {
      const titleBlock = getTitleBlock(blocks) as any;
      const textBlocks = getTextBlocks(blocks) as any[];
      const imageBlocks = getImageBlocks(blocks) as any[];

      if (!titleBlock) return Alert.alert('제목 누락', '제목은 반드시 입력해야 합니다.');
      if (textBlocks.length === 0) return Alert.alert('내용 누락', '텍스트 블록에 최소 한 줄 이상의 내용을 입력해주세요.');
      if (imageBlocks.length === 0) return Alert.alert('이미지 누락', '이미지 블록에 최소 한 장 이상의 이미지를 추가해주세요.');

      const combinedText = textBlocks.map((b) => b.content).join('\n\n');
      const imageFiles: string[] = imageBlocks.flatMap((b) => b.uris || []);

      const formData = new FormData();

      imageFiles.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `image_${index}.jpg`;
        formData.append('images', {
          uri: Platform.OS === 'android' ? uri : normalizeUri(uri),
          name: filename,
          type: 'image/jpeg',
        } as any);
      });

      const payload = {
        title: titleBlock.content,
        content: combinedText,
        placeId: 'sample_place_id',
        postType: 'NEWS',
        startDate: '2025-05-10',
        endDate: '2025-05-20',
        isActive: true,
        username: username || 'anonymous',
        mainContent: blocks,
      };

      formData.append('data', JSON.stringify(payload));

      await apiCall({
        method: 'POST',
        url: '/api/news/register',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('✅ 등록 완료', '뉴스가 성공적으로 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate(HOME_SCREEN_NAME) },
      ]);
    } catch (error: any) {
      console.error('❌ 저장 실패:', error?.response?.data || error?.message);
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
      {/* ✅ iOS에선 KeyboardAvoidingView 비활성화 (점프 방지). Android만 'height' 사용 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'height' : undefined}
        enabled={Platform.OS === 'android'}
      >
        <View style={{ flex: 1 }}>
          <BlockList
            blocks={blocks}
            onBlocksChange={setBlocks}
            onUpdateContent={updateContent}
            onDeleteBlock={deleteBlock}
            onUpdateImages={updateImages}
            footer={
              <EditorToolbar
                onAddTitle={addTitleBlock}
                onAddText={addTextBlock}
                onAddImage={addImageBlock}
                onOpenPreview={() => setPreviewVisible(true)}
                onSave={saveContent}
                saveDisabled={saveDisabled}
                bottomInset={insets.bottom}
              />
            }
          />

          <PreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} blocks={blocks} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomNewsEditor;
