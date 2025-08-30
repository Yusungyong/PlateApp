import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { StyleSheet, Keyboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCreatePost } from '../Hooks/feedCreateHooks/useCreatePost';
import { useNavigation } from '@react-navigation/native';

import ImagePickerComponent from './ImagePickerComponent';
import TextInputComponent from './TextInputComponent';
import MultiFriendInputComponent from './MultiFriendInputComponent';
import LocationSelectorComponent from './LocationSelectorComponent';
import TagInputComponent from './TagInputComponent';
import SelectedLocationPreview from './SelectedLocationPreview';
import { useFriendList } from '../Hooks/feedCreateHooks/useFriendList';

const CreatePost = forwardRef(({ onSubmitStateChange }, ref) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageDimensions, setImageDimensions] = useState({});
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [tags, setTags] = useState([]);

  const friendInputRef = useRef(null);
  const contentInputRef = useRef(null);

  const friendList = useFriendList();
  const { createPost } = useCreatePost();
  const navigation = useNavigation();

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert('오류', '내용을 입력하세요.');
      return;
    }

    if (!location || !isLocationSelected) {
      Alert.alert('오류', '주소 정보를 정확히 선택해주세요.');
      return;
    }

    try {
      onSubmitStateChange(true);
      const friendNames = selectedFriends.map((f) => f.friendName).join(', ');
      const result = await createPost({
        content,
        friend: friendNames,
        images,
        location,
        selectedStoreName,
        tags: tags.join(', '),
      });

      if (result) {
        Alert.alert('성공', '피드가 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('홈', { refresh: true }) },
        ]);
      } else {
        Alert.alert('실패', '피드 등록 실패 다시 시도해주세요.');
      }
    } finally {
      onSubmitStateChange(false);
    }
  }, [content, selectedFriends, images, location, selectedStoreName, tags, isLocationSelected]);

  useImperativeHandle(ref, () => ({ submit: handleSubmit }));

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      enableAutomaticScroll={true}
      scrollEventThrottle={16}
      extraScrollHeight={180}
      keyboardOpeningTime={250}
    >
      <ImagePickerComponent
        images={images}
        setImages={setImages}
        imageDimensions={imageDimensions}
        setImageDimensions={setImageDimensions}
      />

      <TextInputComponent
        ref={contentInputRef}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
        returnKeyType="next"
        onSubmitEditing={() => friendInputRef.current?.focus()}
        blurOnSubmit={false}
      />

      <MultiFriendInputComponent
        friendList={friendList}
        selectedFriends={selectedFriends}
        onChangeSelected={(selected) => setSelectedFriends(selected)}
        inputRef={friendInputRef}
      />

      <TagInputComponent tags={tags} onChangeTags={setTags} />

      {isLocationSelected ? (
        <SelectedLocationPreview
          storeName={selectedStoreName}
          location={location}
          onClear={() => {
            setIsLocationSelected(false);
            setLocation('');
            setSelectedStoreName('');
          }}
        />
      ) : (
        <LocationSelectorComponent
          location={location}
          setLocation={setLocation}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          setSelectedStoreName={setSelectedStoreName}
          setIsLocationSelected={setIsLocationSelected}
        />
      )}
    </KeyboardAwareScrollView>
  );
});

export default CreatePost;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 180,
    paddingHorizontal: 8,
  },
});
