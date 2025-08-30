import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  query: string;
  onChangeQuery: (text: string) => void;
  onSearch: () => void;
};

const SearchBar: React.FC<Props> = ({ query, onChangeQuery, onSearch }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#666" style={styles.icon} />
      <TextInput
        placeholder="장소 또는 키워드 검색"
        style={styles.input}
        value={query}
        onChangeText={onChangeQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        placeholderTextColor="#999"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => onChangeQuery('')}>
          <Icon name="close" size={20} color="#999" style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  clearIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
