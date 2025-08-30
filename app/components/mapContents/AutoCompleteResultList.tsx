import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { requestAndFetchLocation } from '../../common/locationUtils';

interface AutoCompleteItem {
  id: string;
  storeName: string;
  latitude: number;
  longitude: number;
  address?: string;
  location?: string;
  [key: string]: any;
}

interface Props {
  results: AutoCompleteItem[];
  isLoading: boolean;
  onSelect: (item: AutoCompleteItem) => void;
}

const AutoCompleteResultList: React.FC<Props> = ({ results, isLoading, onSelect }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestAndFetchLocation(setCurrentLocation, setError);
  }, []);

  // ✅ 거리 계산 함수
  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const deg2rad = (deg: number) => deg * (Math.PI / 180);
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ 중복 제거 및 거리순 정렬
  const sortedResults = useMemo(() => {
    const seen = new Set();
    const filtered = results.filter((item) => {
      if (seen.has(item.storeName)) return false;
      seen.add(item.storeName);
      return true;
    });

    if (!currentLocation) return filtered;

    return filtered
      .map((item) => ({
        ...item,
        distance: getDistanceFromLatLonInKm(
          currentLocation.latitude,
          currentLocation.longitude,
          item.latitude,
          item.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [results, currentLocation]);

  if (!isLoading && sortedResults.length === 0) return null;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#888" />
        </View>
      ) : (
        <FlatList
          data={sortedResults}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => {
            const addressParts = item.address?.split(' ') || [];
            const shortAddress = `${addressParts[0] || ''} ${addressParts[1] || ''} ${addressParts[2] || ''}`.trim();

            return (
              <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
                <Text style={styles.title}>{item.storeName}</Text>
                <Text style={styles.subText}>
                  {shortAddress}
                  {item.distance ? ` ・ ${item.distance.toFixed(1)}km` : ''}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    maxHeight: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  subText: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
});

export default AutoCompleteResultList;
