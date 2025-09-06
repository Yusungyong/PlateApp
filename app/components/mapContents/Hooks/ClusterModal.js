import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const ClusterModal = ({ visible, data, onClose, onPlay, onComment, onInfo }) => {
  const navigation = useNavigation();

  // storeName 기준 그룹화
  const groupedData = data.reduce((acc, item) => {
    const key = item.storeName || '미등록';
    if (!acc[key]) {
      acc[key] = {
        storeName: key,
        formattedAddress: item.formattedAddress || '',
        videoCount: 0,
        feedCount: 0,
        items: [],
        placeId: item.placeId,
      };
    }
    if (item.storeId !== undefined && item.storeId !== null && item.storeId !== 0) {
      acc[key].videoCount += 1;
    }
    if (item.feedId !== undefined && item.feedId !== null && item.feedId !== 0) {
      acc[key].feedCount += 1;
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const aggregatedData = Object.values(groupedData);

  const renderItem = ({ item }) => {
    const storeIdForGroup = item.items[0]?.storeId;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{item.storeName || 'No Store Name'}</Text>
          <Text style={styles.itemSubText}>{item.formattedAddress}</Text>
        </View>
        <View style={styles.iconsContainer}>
          {item.videoCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                onPlay(storeIdForGroup);
                onClose();
              }}
              style={styles.iconButton}
            >
              <Icon name="play-outline" size={22} color="#000" /> 
              {/* ✅ Ionicons play */}
              <Text style={styles.countText}>{item.videoCount}</Text>
            </TouchableOpacity>
          )}
          {item.feedCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HomeFeed', { placeId: item.placeId, refresh: true });
                onClose();
              }}
              style={styles.iconButton}
            >
              <Icon name="chatbubble-outline" size={22} color="#000" /> 
              {/* ✅ Ionicons chat */}
              <Text style={styles.countText}>{item.feedCount}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>주변정보({data.length})</Text>
              <FlatList
                data={aggregatedData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={true}
              />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: windowHeight * 0.8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  itemSubText: {
    fontSize: 14,
    color: '#666',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  closeText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ClusterModal;
