import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BRAND = '#007AFF';
const BG_CARD = '#fff';
const BG_ROW = '#f9f9fb';
const TEXT_GRAY = '#767A83';

const StoreFeedSection = ({ feeds, onFeedPress }) => {
  if (!feeds || feeds.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>등록된 피드/영상이 없습니다.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={feeds}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.feedRow} activeOpacity={0.85} onPress={() => onFeedPress?.(item)}>
          <View style={styles.thumbWrap}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.feedThumb}
              resizeMode="cover"
            />
            {/* 영상일 경우 오버레이 라벨/플레이 아이콘 */}
            {item.type === 'video' && (
              <View style={styles.videoBadge}>
                <Text style={styles.badgeText}>영상</Text>
                {/* 실제 앱에서는 플레이 아이콘 SVG/PNG 추가 */}
              </View>
            )}
            {item.type === 'feed' && (
              <View style={styles.feedBadge}>
                <Text style={styles.badgeText}>피드</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text numberOfLines={1} style={styles.feedTitle}>{item.title || '(제목 없음)'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
              {/* 작성자 아바타 자리(원한다면 추가) */}
              {/* <Image source={{uri: item.authorProfileImg}} style={styles.avatar} /> */}
              <Text style={styles.feedInfo}>{item.username}</Text>
              <Text style={styles.feedDate}> · {item.createdAt?.slice(0,10)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 6 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      style={{ borderRadius: 18, overflow: 'hidden' }}
    />
  );
};

const styles = StyleSheet.create({
  emptyBox: {
    padding: 36,
    backgroundColor: BG_CARD,
    borderRadius: 18,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyText: {
    color: TEXT_GRAY,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_ROW,
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  thumbWrap: {
    position: 'relative',
    width: 74,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ececec',
    marginRight: 4,
  },
  feedThumb: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: BRAND,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    opacity: 0.88,
  },
  feedBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#777',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    opacity: 0.85,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  feedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A202C',
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  feedInfo: {
    color: TEXT_GRAY,
    fontSize: 13,
    fontWeight: '600',
  },
  feedDate: {
    color: '#B2B8C2',
    fontSize: 12,
    marginLeft: 2,
  },
});

export default StoreFeedSection;
