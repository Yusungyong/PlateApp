import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface Props {
  tags: string[];
  onChangeTags: (updated: string[]) => void;
  maxTags?: number;
  placeholder?: string; // optional override
}

const tagPlaceholders = [
  '오늘의 맛을 태그로 표현해보세요 :) 예: 매콤한, 부드러운',
  '무엇을 드셨나요? 예: 감바스, 라멘, 떡볶이',
  '음식의 느낌을 한 단어로 적어보세요 :)',
  '예: 얼큰한 국물, 고소한 맛, 달콤한 디저트',
];

const TagInputComponent: React.FC<Props> = ({
  tags,
  onChangeTags,
  maxTags = 5,
  placeholder,
}) => {
  const [input, setInput] = useState('');
  const [randomPlaceholder, setRandomPlaceholder] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tagPlaceholders.length);
    setRandomPlaceholder(tagPlaceholders[randomIndex]);
  }, []);

  const addTag = () => {
    const trimmed = input.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onChangeTags([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChangeTags(newTags);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagWrapper}>
        {tags.map((tag, idx) => (
          <View style={styles.tag} key={`${tag}-${idx}`}>
            <Text style={styles.tagText}>#{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(idx)}>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {tags.length < maxTags && (
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder || randomPlaceholder}
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            returnKeyType="done"
            onSubmitEditing={addTag}
            onBlur={addTag}
          />
          {input.length > 0 && (
            <TouchableOpacity onPress={addTag} style={styles.addButton}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F0EB',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 14,
    color: '#D67B4D',
    fontWeight: '500',
  },
  removeIcon: {
    fontSize: 14,
    marginLeft: 6,
    color: '#D67B4D',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 13,
    paddingRight: 60,
  },
  addButton: {
    position: 'absolute',
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#D67B4D',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TagInputComponent;
