import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Suggestion = {
  id: string;
  imageUrl: string;
  title?: string;
  storeName?: string;
  distance?: string;
  type: 'feed' | 'video'; // ✅ 추가
};

interface Props {
  data: Suggestion[];
}

const ThumbnailSuggestionList: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>추천 결과가 없습니다 🙏</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {data.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />

          <View style={styles.textContainer}>
            <View style={styles.row}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title || '메뉴명 미상'}
              </Text>
              <Text
                style={[
                  styles.typeLabel,
                  item.type === 'video' ? styles.videoType : styles.feedType,
                ]}
              >
                {item.type === 'video' ? '동영상' : '피드'}
              </Text>
            </View>

            <View style={styles.subInfoContainer}>
              <Text style={styles.storeName} numberOfLines={1}>
                {item.storeName}
              </Text>

              {item.distance && (
                <View style={styles.distanceContainer}>
                  <Icon name="location-outline" size={14} color="#999" style={{ marginRight: 2 }} />
                  <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
    flex: 1,
    marginRight: 8,
  },
  typeLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  videoType: {
    backgroundColor: '#ffefe0',
    color: '#ff7f50',
  },
  feedType: {
    backgroundColor: '#e0f0ff',
    color: '#3399ff',
  },
  subInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeName: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 13,
    color: '#777',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});

export default ThumbnailSuggestionList;
