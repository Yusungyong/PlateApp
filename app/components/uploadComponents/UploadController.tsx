import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonLayout from '../../common/CommonLayout';
import CreatePost from '../FeedComponents/CreateFeed/CreatePost';
import SubmitButtonComponent from '../FeedComponents/CreateFeed/SubmitButtonComponent';
import UploadContents from './UploadContents';

type OptionType = 'feed' | 'video';

interface UploadControllerProps {}

export interface SubmitHandler {
  submit: () => void;
}

const UploadController: React.FC<UploadControllerProps> = () => {
  const [selectedOption, setSelectedOption] = useState<OptionType>('feed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation<NavigationProp<any>>();

  // ref에 명확한 인터페이스 지정
  const createPostRef = useRef<SubmitHandler>(null);
  const uploadContentsRef = useRef<SubmitHandler>(null);

  const options = [
    { label: '피드', value: 'feed' as OptionType },
    { label: '영상', value: 'video' as OptionType },
  ];

  const handleSubmit = () => {
    if (isSubmitting) return; // 중복 제출 방지

    setIsSubmitting(true);

    const submitPromise =
      selectedOption === 'feed'
        ? createPostRef.current?.submit()
        : uploadContentsRef.current?.submit();

    Promise.resolve(submitPromise)
      .finally(() => setIsSubmitting(false));
  };

  return (
      <CommonLayout>
        <View style={styles.container}>
          {/* 상단 헤더 */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="뒤로가기"
            >
              <Ionicons name="arrow-back" size={28} color="#FF7F50" />
            </TouchableOpacity>

            <View style={styles.segmentContainer}>
              {options.map((option) => {
                const isSelected = selectedOption === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.segmentButton,
                      isSelected && styles.segmentButtonSelected,
                    ]}
                    onPress={() => setSelectedOption(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.segmentTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 등록 버튼 */}
            <SubmitButtonComponent
              onPress={handleSubmit}
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
            />
          </View>

          {/* 본문 영역 */}
          <View style={styles.contentContainer}>
            {selectedOption === 'feed' ? (
              <CreatePost
                ref={createPostRef}
                onSubmitStateChange={setIsSubmitting}
              />
            ) : (
              <UploadContents
                ref={uploadContentsRef}
                onSubmitStateChange={setIsSubmitting}
              />
            )}
          </View>
        </View>
      </CommonLayout>
  );
};

export default UploadController;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 10,
    borderRadius: 24, // 터치 영역 키움
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF7F50',
    overflow: 'hidden',
    flex: 1,
    marginHorizontal: 16,
  },
  segmentButton: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  segmentButtonSelected: {
    backgroundColor: '#FF7F50',
  },
  segmentText: {
    fontSize: 16,
    color: '#FF7F50',
    textAlign: 'center',
  },
  segmentTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
});
