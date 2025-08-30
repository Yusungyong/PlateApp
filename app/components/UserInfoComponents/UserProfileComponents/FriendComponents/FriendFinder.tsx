import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useSearchUsers from './Hooks/useSearchUsers';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import SearchResultsList from './SearchResultsList';
import CommonLayout from '../../../../common/CommonLayout';

const FriendFinder = () => {
  const { searchResults, error, searchUsers } = useSearchUsers();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshFriendList = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <CommonLayout>
      <View style={styles.container}>
        <SearchBar onSearch={searchUsers} />
        {error && <Text style={styles.error}>에러: {error}</Text>}

        {searchResults.length > 0 ? (
          <SearchResultsList 
            results={searchResults} 
            onAddFriend={refreshFriendList} 
          />
        ) : (
          <FriendList key={refreshKey} />
        )}
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default FriendFinder;
