import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';

interface LocationAutocompleteProps {
  placeholder?: string;
  onLocationSelected: (storeName: string, address: string, telNo: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  placeholder = '위치(필수)',
  onLocationSelected,
}) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');
  const [restaurantAddress, setRestaurantAddress] = useState<string>('');
  const [selectedStoreTelNo, setSelectedStoreTelNo] = useState<string>('');

  // 주소 검색 함수
  const searchAddress = async (text: string) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://openapi.naver.com/v1/search/local.json?query=${text}&display=5`,
        {
          method: 'GET',
          headers: {
            'X-Naver-Client-Id': 'tRElJCITUUFGIKuF5m3M',
            'X-Naver-Client-Secret': 'OlHxBtV5c3',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data.items.slice(0, 2));
    } catch (error) {
      console.error('검색 오류: ', error);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    const cleanTitle = item.title.replace(/<[^>]*>?/g, '');
    setRestaurantAddress(item.address);
    setQuery(item.address);
    setSelectedStoreName(cleanTitle);
    setSelectedStoreTelNo(item.telephone);
    setSuggestions([]);
    setIsEditing(false);
    Keyboard.dismiss();
    // 부모 컴포넌트로 선택된 데이터를 전달
    onLocationSelected(cleanTitle, item.address, item.telephone);
  };

  return (
    <View style={styles.autocompleteContainer}>
      {isEditing ? (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          autoCorrect={false}
          autoCapitalize="none"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            searchAddress(text);
          }}
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.selectedContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.selectedStoreName}>{selectedStoreName}</Text>
              <Text style={styles.selectedAddress}>{restaurantAddress}</Text>
            </View>
            <Text style={styles.editButton}>수정</Text>
          </View>
        </TouchableOpacity>
      )}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectSuggestion(item)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>
                {item.title.replace(/<[^>]*>?/g, '')}
              </Text>
              <Text style={styles.suggestionAddress}>{item.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,
    alignSelf: 'stretch',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  selectedContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  selectedStoreName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedAddress: {
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default LocationAutocomplete;
