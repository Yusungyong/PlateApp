import React, { useState, useMemo, useEffect } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDebouncedValue } from './useDebouncedValue';
import { profileBucket } from '../../../config/config';

interface Friend {
  friendName?: string;
  username: string;
  profileImageUrl?: string;
}

interface Props {
  placeholder?: string;
  friendList?: Friend[];
  selectedFriends?: Friend[];
  onChangeSelected?: (friends: Friend[]) => void;
  inputRef?: React.RefObject<TextInput>;
}

const MultiFriendInputComponent: React.FC<Props> = ({
  placeholder = ' + 같이간 친구',
  friendList = [],
  selectedFriends: externalSelectedFriends,
  onChangeSelected,
  inputRef,
}) => {
  const [searchText, setSearchText] = useState('');
  const [internalSelected, setInternalSelected] = useState<Friend[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const selectedFriends = externalSelectedFriends ?? internalSelected;

  const debouncedSearch = useDebouncedValue(searchText, 300);

  const filteredFriends = useMemo(() => {
    if (!debouncedSearch) return [];

    const friendNameMatched = friendList
      .filter(
        (friend) =>
          !!friend &&
          !!friend.friendName &&
          (friend.friendName || '').toLowerCase().includes((debouncedSearch || '').toLowerCase()) &&
          !selectedFriends.some(
            (sel) =>
              (sel.friendName || sel.username) === (friend.friendName || friend.username)
          )
      );

    const usernameMatched = friendList
      .filter(
        (friend) =>
          !!friend &&
          !friend.friendName &&
          (friend.username || '').toLowerCase().includes((debouncedSearch || '').toLowerCase()) &&
          !selectedFriends.some(
            (sel) => (sel.friendName || sel.username) === friend.username
          )
      );

    return [...friendNameMatched, ...usernameMatched].slice(0, 5);
  }, [debouncedSearch, friendList, selectedFriends]);

  const updateSelected = (newList: Friend[]) => {
    if (!externalSelectedFriends) {
      setInternalSelected(newList);
    }
    onChangeSelected?.(newList);
  };

  const handleSelectFriend = (friend: Friend) => {
    const updated = [...selectedFriends, friend];
    updateSelected(updated);
    setSearchText('');
    setTimeout(() => {
      inputRef?.current?.focus();
      setIsFocused(true);
    }, 200);
  };

  const handleRemoveFriend = (key: string) => {
    const updated = selectedFriends.filter(
      (f) => (f.friendName || f.username) !== key
    );
    updateSelected(updated);
  };

  return (
    <View>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="done"
      />

      {isFocused && filteredFriends.length > 0 && (
        <View style={styles.suggestionContainer}>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 160 }}>
            {filteredFriends.map((item, index) => (
              <Pressable
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSelectFriend(item)}
              >
                <FriendAvatar imageUrl={item.profileImageUrl} />
                <Text>{item.friendName || item.username}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.tagContainer}>
        {selectedFriends.map((friend, idx) => (
          <View key={idx} style={styles.tag}>
            <FriendAvatar imageUrl={friend.profileImageUrl} size={20} />
            <Text style={styles.tagText}>{friend.friendName || friend.username}</Text>
            <TouchableOpacity onPress={() => handleRemoveFriend(friend.friendName || friend.username)}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const FriendAvatar = ({ imageUrl, size = 32 }: { imageUrl?: string; size?: number }) => (
  <FastImage
    style={{ width: size, height: size, borderRadius: size / 2, marginRight: 10 }}
    source={
      imageUrl ? { uri: profileBucket + imageUrl } : require('../../../../images/IMG_8327.jpg')
    }
    resizeMode={FastImage.resizeMode.cover}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  tagText: { fontSize: 13 },
  removeText: { fontSize: 16, color: '#999', marginLeft: 4 },
});

export default MultiFriendInputComponent;
