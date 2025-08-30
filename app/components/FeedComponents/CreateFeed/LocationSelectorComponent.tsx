import React, { useCallback } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  View,
} from 'react-native';
import debounce from 'lodash/debounce';
import { searchAddress } from '../../../common/searchAddress';

interface LocationSelectorProps {
  location: string;
  setLocation: (loc: string) => void;
  suggestions: any[];
  setSuggestions: (suggestions: any[]) => void;
  setSelectedStoreName: (storeName: string) => void;
  setIsLocationSelected: (selected: boolean) => void;
}

const LocationSelectorComponent: React.FC<LocationSelectorProps> = ({
  location,
  setLocation,
  suggestions,
  setSuggestions,
  setSelectedStoreName,
  setIsLocationSelected,
}) => {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchAddress(query).then(results => setSuggestions(results));
    }, 500),
    []
  );

  const handleChangeLocation = (text: string) => {
    setLocation(text);
    setIsLocationSelected(false); // 주소 다시 입력하면 선택된 상태 해제
    debouncedSearch(text);
  };
  

  const handleSelectSuggestion = (item: any) => {
    setLocation(item.address);
    setSelectedStoreName(stripHtml(item.title));
    setSuggestions([]);
    setIsLocationSelected(true);
    Keyboard.dismiss();
  };

  return (
    <View>
      <TextInput
        style={[styles.input]}
        placeholder="위치를 입력하세요.(선택)"
        value={location}
        onChangeText={handleChangeLocation}
      />
      {suggestions.map((item, index) => (
        <LocationSuggestionItem key={index} item={item} onSelect={handleSelectSuggestion} />
      ))}
    </View>
  );
};

const LocationSuggestionItem = ({ item, onSelect }: { item: any; onSelect: (item: any) => void }) => (
  <TouchableOpacity onPress={() => onSelect(item)} style={styles.suggestionItem}>
    <Text style={styles.suggestionText}>{stripHtml(item.title)}</Text>
    <Text style={styles.suggestionAddress}>
      {item.address.split(' ').slice(0, 3).join(' ')}
    </Text>
  </TouchableOpacity>
);

const stripHtml = (str: string) => str.replace(/<[^>]*>?/g, '');

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
  },
  suggestionItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  suggestionAddress: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
});

export default LocationSelectorComponent;
