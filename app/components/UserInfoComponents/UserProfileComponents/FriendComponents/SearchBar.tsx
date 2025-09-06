import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      onSearch(searchText); // 부모 컴포넌트로 검색어 전달
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="새로운 친구 찾기"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch} // 키보드 완료 버튼으로 검색
      />
      <Icon
        name="search-outline"
        size={24}
        color="#666"
        onPress={handleSearch} // 돋보기 아이콘으로 검색
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  icon: {
    padding: 5,
  },
});

export default SearchBar;
