import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CommonLayout from '../../common/CommonLayout';
import SearchBar from './SearchBar';
import StoreList from './StoreList';
import { useStoreInfo } from './useStoreInfo';
import { requestAndFetchLocation } from '../../common/locationUtils';

const PAGE_SIZE = 10;

const StoreListScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [storeList, setStoreList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { fetchStoreList } = useStoreInfo();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  // 위치 요청은 최초 1회
  useEffect(() => {
    requestAndFetchLocation(setLocation, setLocationError);
  }, []);

  // 위치가 들어온 이후에만 loadStores 호출
  useEffect(() => {
    if (location) {
      loadStores(1);
    }
  }, [location]);

  const loadStores = async (newPage = 1, isAppend = false, keyword = searchText) => {
    if (newPage === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const result = await fetchStoreList({
        searchTxt: keyword,
        page: newPage,
        size: PAGE_SIZE,
        includeCount: newPage === 1,
        userLatitude: location?.latitude,
        userLongitude: location?.longitude,
      });

      const newList = isAppend ? [...storeList, ...result.list] : result.list;
      setStoreList(newList);
      if (newPage === 1) setTotalCount(result.totalCount);
      setPage(newPage);
    } catch (e) {
      console.error('불러오기 실패:', e);
    } finally {
      if (newPage === 1) setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearchSubmit = () => {
    loadStores(1, false, searchText);
  };

  const handleEndReached = () => {
    if (!isFetchingMore && storeList.length < totalCount) {
      setIsFetchingMore(true);
      setTimeout(() => {
        loadStores(page + 1, true);
      }, 500);
    }
  };

  return (
    <CommonLayout>
      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>검색결과 : {totalCount}건</Text>
      </View>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearchSubmit}
      />

      {loading && page === 1 ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#999" />
      ) : (
        <StoreList
          data={storeList}
          onEndReached={handleEndReached}
          isFetchingMore={isFetchingMore}
          loading={loading}
          totalCount={totalCount}
        />
      )}
    </CommonLayout>
  );
};

export default StoreListScreen;

const styles = StyleSheet.create({
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
    marginTop: 16,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
});
