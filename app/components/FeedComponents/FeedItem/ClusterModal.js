import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useNavigation } from '@react-navigation/native';
import BottomSlideModal from './BottomSlideModal';
import usePlaceInfo from '../../../common/usePlaceInfo';

const ClusterModal = ({ visible, onClose, placeId, storeName }) => {
  const { placeInfo, loading, error } = usePlaceInfo(placeId, storeName);
  const navigation = useNavigation();

  const { storeCount, feedCount, feedIds, firstStoreId } = useMemo(() => {
    const stores = new Set();
    const feeds = new Set();
    let first = null;

    if (Array.isArray(placeInfo)) {
      for (const { storeId, feedId } of placeInfo) {
        if (storeId) {
          stores.add(storeId);
          if (!first) first = storeId;
        }
        if (feedId) feeds.add(feedId);
      }
    }

    return {
      storeCount: stores.size,
      feedCount: feeds.size,
      feedIds: Array.from(feeds),
      firstStoreId: first,
    };
  }, [placeInfo]);

  const handlePlayPress = () => {
    if (!firstStoreId) {
      Alert.alert('알림', '해당 장소에 등록된 영상이 없습니다.');
      return;
    }
    onClose();
    navigation.navigate('재생', { storeId: firstStoreId });
  };

  const handleFeedPress = () => {
    onClose();
    navigation.navigate('HomeFeed', {
      placeId,
      refresh: true,
    });
  };

  return (
    <BottomSlideModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>주변 정보</Text>

      {loading && <ActivityIndicator size="small" color="gray" />}
      {error && <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>}

      <View style={styles.headerRow}>
        <Text style={styles.storeName}>{storeName}</Text>
        <View style={styles.countContainer}>
          <TouchableOpacity style={styles.countItem} onPress={handlePlayPress}>
            <Icon name="play" size={22} color="#000" /> 
            {/* ✅ Ionicons play 아이콘 */}
            <Text style={styles.countText}>{storeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countItem} onPress={handleFeedPress}>
            <Icon name="chatbubble-outline" size={22} color="#000" /> 
            {/* ✅ Ionicons chat 아이콘 */}
            <Text style={styles.countText}>{feedCount}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </BottomSlideModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  countContainer: {
    flexDirection: 'row',
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  countText: {
    fontSize: 16,
    marginLeft: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClusterModal;
