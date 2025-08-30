import React from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import StoreCard from './StoreCard';

interface StoreListProps {
  data: any[];
  onEndReached: () => void;
  isFetchingMore: boolean;
  loading: boolean;
  totalCount: number;
}

const StoreList: React.FC<StoreListProps> = ({
  data,
  onEndReached,
  isFetchingMore,
  loading,
  totalCount,
}) => {
  const renderItem = ({ item }: any) => <StoreCard item={item} />;

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.storeId ?? `${item.storeName}_${item.address}`)}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      ListFooterComponent={
        isFetchingMore ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
      }
      ListEmptyComponent={renderEmpty}
    />
  );
};

export default StoreList;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});
