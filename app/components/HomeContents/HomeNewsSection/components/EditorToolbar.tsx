import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

interface Props {
  onAddTitle: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onOpenPreview: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  bottomInset?: number;
}

const EditorToolbar: React.FC<Props> = ({
  onAddTitle,
  onAddText,
  onAddImage,
  onOpenPreview,
  onSave,
  saveDisabled,
  bottomInset = 0,
}) => {
  return (
    <View style={[styles.toolbar, { paddingBottom: 8 + bottomInset }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolsRowContent}
      >
        <ToolButton label="+ 제목" onPress={onAddTitle} />
        <ToolButton label="+ 텍스트" onPress={onAddText} />
        <ToolButton label="+ 이미지" onPress={onAddImage} />
        <ToolButton label="👁 미리보기" onPress={onOpenPreview} />
        <TouchableOpacity
          disabled={!!saveDisabled}
          onPress={onSave}
          style={[styles.saveButton, saveDisabled && styles.saveDisabled]}
        >
          <Text style={styles.saveText}>✔ 저장</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ToolButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.toolBtn}>
    <Text style={styles.toolText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toolbar: {
    // ✅ absolute 제거: 리스트 하단 푸터로 보여주기 위함
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  toolsRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  toolText: { fontSize: 14, color: '#374151' },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginLeft: 4,
  },
  saveDisabled: { opacity: 0.5 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default EditorToolbar;
