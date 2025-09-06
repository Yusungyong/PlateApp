import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Ionicons로 교체
import { useNavigation } from '@react-navigation/native';
import ClusterModal from './ClusterModal';

const PlaceInfoHeader = ({ feedData }) => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLocationPress = useCallback(() => {
    navigation.navigate('지도', {
      initialLatitude: feedData.latitude,
      initialLongitude: feedData.longitude,
      initialLatitudeDelta: 0.005,
      initialLongitudeDelta: 0.005,
    });
  }, [navigation, feedData]);

  const handleStorePress = () => {
    setModalVisible(true);
  };

  const formatLocation = (location) => {
    if (!location) return '';
    return location.split(' ').slice(0, 3).join(' ');
  };

  return (
    <>
      {feedData.location && (
        <View style={styles.locationRow}>
          <TouchableOpacity onPress={handleLocationPress} style={styles.locationTouchable}>
            <Icon name="location-outline" size={14} color="black" /> 
            {/* ✅ Ionicons 위치 아이콘 */}
            <Text style={styles.locationText}>{formatLocation(feedData.location)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStorePress}>
            <Text style={styles.storeNameText} numberOfLines={1} ellipsizeMode="tail">
              {feedData.storeName}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ClusterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        placeId={feedData.placeId}
        storeId={feedData.storeId}
        storeName={feedData.storeName}
      />
    </>
  );
};

const styles = StyleSheet.create({
  locationTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  storeNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    maxWidth: 120, // 너무 길면 줄이기
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 8,
  },
});

export default PlaceInfoHeader;
