import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleSearch = () => {
    if (!query.trim()) {
      Alert.alert('검색어를 입력해주세요!');
      return;
    }
    // 검색 로직 연결
  };

  return (
    <View
      style={[
        styles.searchContainer,
        isFocused && styles.focusedContainer,
        isDarkMode && styles.darkMode,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { color: isDarkMode ? '#eee' : '#333' },
        ]}
        placeholder="검색어를 입력하세요"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Icon name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  focusedContainer: {
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  darkMode: {
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingLeft: 4,
  },
  searchButton: {
    backgroundColor: '#FF7F50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchForm;
