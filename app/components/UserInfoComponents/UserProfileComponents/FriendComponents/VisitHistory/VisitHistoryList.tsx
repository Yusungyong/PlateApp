import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import VisitHistoryItem from './VisitHistoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VisitHistoryList = ({ data, onRecommendPress }) => {
  // storeName + visitDate 기준으로 그룹화
  const groupedData = data.reduce((acc, item) => {
    const key = `${item.storeName}-${item.visitDate}`;

    if (!acc[key]) {
      acc[key] = {
        storeName: item.storeName,
        visitDate: item.visitDate,
        address: item.address,
        image: item.image,
        type: item.type,
        friendProfileImageUrl: item.friendProfileImageUrl,  // 프로필 이미지 추가
        friendName: item.friendName,                        // 닉네임 추가
      };
    }

    return acc;
  }, {});

  const sections = Object.values(groupedData);

  return (
    sections.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ddd" style={styles.icon} />
        <Text style={styles.emptyText}>아직 친구와 함께한 방문 기록이 없어요</Text>
        <Text style={styles.emptySubText}>좋은 추억을 함께 만들어볼까요?</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onRecommendPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.buttonText}>추천 식당 보러가기</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <VisitHistoryItem item={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    )
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF7F50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VisitHistoryList;
