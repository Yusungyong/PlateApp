import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageBlock from './ImageBlock';
import type { Block } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  blocks: Block[];
}

const PreviewModal: React.FC<Props> = ({ visible, onClose, blocks }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      {/* ✅ 상단은 헤더에 직접 적용할 것이므로 bottom만 SafeArea 처리 */}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* ✅ 상단 인셋을 헤더에 직접 적용 → 노치/상태바 영역 아래로 내려옴(터치 OK) */}
        <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
          <Text style={styles.headerTitle}>미리보기</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 40 + insets.bottom }, // 하단 홈바 여백
          ]}
        >
          {blocks.map((block) => (
            <View key={block.id} style={{ marginBottom: 20 }}>
              {block.type === 'image' ? (
                <ImageBlock
                  uris={(block as any).uris || []}
                  aspectRatios={(block as any).aspectRatios}
                />
              ) : (
                <Text style={block.type === 'title' ? styles.title : styles.text}>
                  {(block as any).content}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    // height는 동적으로 덮어씌움
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff', // ✅ 상태바 아래 겹침 방지 및 터치 명확화
    zIndex: 1,               // ✅ 혹시 모를 겹침 대비
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  closeBtn: { padding: 8 },
  closeText: { color: '#007AFF', fontWeight: '700' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  text: { fontSize: 16, color: '#333' },
});

export default PreviewModal;
