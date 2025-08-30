import React from 'react';
import { View, Button, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import { useUploadFile } from './useUploadFile';
import { useSearchAddress } from './useSearchAddress';

const UploadContents: React.FC<{ onStoreIdCreated: (id: string) => void }> = ({ onStoreIdCreated }) => {
  const { file, thumbnail, isLoading, selectFile, uploadFile } = useUploadFile();
  const { query, setQuery, suggestions, searchAddress, handleSelectSuggestion, selectedStoreName, restaurantAddress } =
    useSearchAddress();

  return (
    <View>
      <TextInput
        placeholder="위치 검색"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          searchAddress(text);
        }}
      />
      {suggestions.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleSelectSuggestion(item)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
      <Button title="파일 선택" onPress={selectFile} />
      {thumbnail && <Image source={{ uri: thumbnail.path }} />}
      <Button title="업로드" onPress={() => uploadFile({ title: '', restaurantAddress, storeName: selectedStoreName })} />
    </View>
  );
};

export default UploadContents;
