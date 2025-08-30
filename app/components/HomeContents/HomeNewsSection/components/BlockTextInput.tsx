import React, { useMemo, useState } from 'react';
import { TextInput, StyleSheet, TextStyle } from 'react-native';

interface Props {
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
  isTitle?: boolean;
  onFocus?: () => void; // ✅ 추가
}

const BlockTextInput: React.FC<Props> = ({ value, placeholder, onChangeText, isTitle, onFocus }) => {
  const [height, setHeight] = useState(0);
  const inputStyle = useMemo<TextStyle[]>(
    () => [
      styles.input,
      isTitle ? styles.title : styles.body,
      height ? { height } : { minHeight: isTitle ? 44 : 36 },
    ],
    [isTitle, height]
  );

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline
      onFocus={onFocus} // ✅ 포커스 콜백
      onContentSizeChange={(e) =>
        setHeight(Math.max(isTitle ? 44 : 36, Math.ceil(e.nativeEvent.contentSize.height)))
      }
      style={inputStyle}
    />
  );
};

const styles = StyleSheet.create({
  input: { color: '#111827', paddingVertical: 8 },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 22 },
});

export default BlockTextInput;
