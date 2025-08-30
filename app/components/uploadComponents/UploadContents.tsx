import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FileSelector from './component/FileSelector';
import LocationAutocomplete from './hooks/LocationAutocomplete';
import MultiFriendInputComponent from '../FeedComponents/CreateFeed/MultiFriendInputComponent';
import { useUploadStoreInfo } from './hooks/useUploadStoreInfo';
import { useFriendList } from './hooks/useFriendList';
import { getGeocodeData, prepareFormData } from './hooks/uploadUtils';

const UploadContents = forwardRef(({ onSubmitStateChange }, ref) => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeTel, setStoreTel] = useState('');
  const [description, setDescription] = useState('');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const friendInputRef = useRef(null);
  const navigation = useNavigation();
  const { upload } = useUploadStoreInfo();
  const friendList = useFriendList();

  useImperativeHandle(ref, () => ({ submit }));

  // ⭐️ 화면이 사라질 때 file(및 썸네일 등) 초기화
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFile(null);
        setThumbnail(null);
      };
    }, [])
  );

  const submit = async () => {
    if (!file || !storeAddress) {
      return Alert.alert('필수 항목 누락', '영상과 위치는 필수입니다.');
    }

    try {
      onSubmitStateChange(true);
      const username = await AsyncStorage.getItem('username');
      const token = await AsyncStorage.getItem('Authorization');
      if (!username || !token) throw new Error('인증 정보가 없습니다.');

      const geocodeData = await getGeocodeData(storeAddress, username);
      const formData = prepareFormData({
        file,
        thumbnail,
        storeName,
        storeAddress,
        storeTel,
        description,
        selectedFriends,
        removeAudio,
        username,
      });

      const storeId = await upload({ formData, accessToken: token, geocodeData });
      await AsyncStorage.setItem('storeId', String(storeId));

      Alert.alert('업로드 완료', '영상 업로드 성공', [
        { text: '확인', onPress: () => navigation.navigate('홈') },
      ]);
    } catch (err) {
      Alert.alert('오류', err.message || '업로드 중 문제가 발생했습니다.');
    } finally {
      onSubmitStateChange(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={130}
          >
            <FileSelector
              file={file}
              thumbnail={thumbnail}
              setFile={setFile}
              setThumbnail={setThumbnail}
              removeAudio={removeAudio}
              setRemoveAudio={setRemoveAudio}
              isLoading={false}
              setIsLoading={() => {}}
            />

            <TextInput
              style={styles.descriptionInput}
              placeholder="내용을 입력해주세요"
              value={description}
              onChangeText={setDescription}
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
            />

            <LocationAutocomplete
              onLocationSelected={(name, addr, tel) => {
                setStoreName(name);
                setStoreAddress(addr);
                setStoreTel(tel);
              }}
            />

            <MultiFriendInputComponent
              friendList={friendList}
              onChangeSelected={setSelectedFriends}
              inputRef={friendInputRef}
            />
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

export default UploadContents;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginTop: 10,
    marginBottom: 10,
    minHeight: 120,
  },
});
