import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import VisitHistoryHeader from './VisitHistoryHeader';
import VisitHistoryItem from './VisitHistoryItem';
import CommonLayout from '../../../../../common/CommonLayout';

const VisitHistoryScreen = ({ route }) => {
  const { visitData = [] } = route.params || {};

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>아직 친구와 함께한 방문 기록이 없어요 😥</Text>
    </View>
  );

  return (
    <CommonLayout>
      <FlatList
        data={visitData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() =>
          visitData.length > 0 && (
            <VisitHistoryHeader
              friendProfileImageUrl={visitData[0]?.friendProfileImageUrl}
              friendName={visitData[0]?.friendName}
              visitData={visitData}
            />
          )
        }
        renderItem={({ item }) => <VisitHistoryItem item={item} />}
        contentContainerStyle={visitData.length === 0 ? styles.emptyPadding : { paddingBottom: 40 }}
        ListEmptyComponent={renderEmpty}
      />
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
  emptyPadding: {
    flexGrow: 1, // 비어있을 때 꽉 채우기
  },
});

export default VisitHistoryScreen;
