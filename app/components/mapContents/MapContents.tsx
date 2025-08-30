import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CommonLayout from '../../../common/CommonLayout';

import useMapLocation from './useMapLocation';
import useFetchSearchData from './Hooks/useFetchSearchData';
import { zoomToRadius } from './Hooks/zoomToRadius';
import { useAutoCompleteData } from './Hooks/useAutoCompleteData';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchMarkers from './SearchMarkers';
import SearchRadius from './SearchRadius';
import RefetchButton from './RefetchButton';
import UserLocationButton from './UserLocationButton';
import BackSwipeArea from './BackSwipeArea';
import ClusterModal from './Hooks/ClusterModal';
import SearchBar from './SearchBar';
import AutoCompleteResultList from './AutoCompleteResultList';

const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.9780;
const INIT_DELTA = 0.02;

type MapScreenRouteProp = RouteProp<{ params: { initialLatitude?: number; initialLongitude?: number } }, 'params'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<MapScreenRouteProp>();
  const mapRef = useRef<MapView | null>(null);
  const hasAnimated = useRef(false);

  const { initialLatitude, initialLongitude } = route.params || {};
  const defaultLat = typeof initialLatitude === 'number' ? initialLatitude : DEFAULT_LAT;
  const defaultLon = typeof initialLongitude === 'number' ? initialLongitude : DEFAULT_LON;

  const initialRegion: Region = useMemo(
    () => ({
      latitude: defaultLat,
      longitude: defaultLon,
      latitudeDelta: INIT_DELTA,
      longitudeDelta: INIT_DELTA,
    }),
    [defaultLat, defaultLon]
  );

  // 중심좌표를 "완전히 동기화"!
  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);

  const {
    mapCenter,
    mapDelta,
    fillColor,
    setRegionManually,
    requestUserLocation,
    triggerRadiusBlink,
  } = useMapLocation(initialRegion, mapRef, setCurrentRegion);

  const { searchData, refetch, loading } = useFetchSearchData(
    mapCenter.latitude,
    mapCenter.longitude,
    zoomToRadius(mapDelta)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [clusterData, setClusterData] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const { results, isLoading } = useAutoCompleteData(query);

  const handleSearch = useCallback(() => {
    console.log('🔍 검색어:', query);
  }, [query]);

  const handleSelectAutoComplete = useCallback(async (item: any) => {
    Keyboard.dismiss();

    const region: Region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapRef.current?.animateToRegion(region, 500);
    setRegionManually(region);

    const radius = zoomToRadius(region.latitudeDelta);
    const results = await refetch(region.latitude, region.longitude, radius);

    const nearbyGroup = results.filter((d: any) => {
      const latDiff = Math.abs(Number(d.latitude) - item.latitude);
      const lonDiff = Math.abs(Number(d.longitude) - item.longitude);
      return latDiff < 0.0005 && lonDiff < 0.0005;
    });

    if (nearbyGroup.length > 0) {
      setClusterData(nearbyGroup);
      setModalVisible(true);
    }
  }, [refetch, setRegionManually]);

  const handleClusterPress = useCallback((group: any[]) => {
    setClusterData(group);
    setModalVisible(true);
  }, []);

  const handlePlay = useCallback(
    (storeId: string | number) => {
      setModalVisible(false);
      navigation.navigate('재생', { storeId });
    },
    [navigation]
  );

  const handleComment = useCallback(
    (item: any) => {
      if (item) {
        navigation.navigate('FeedDetail', { feedData: item });
      } else {
        Alert.alert('피드 없음', '해당 그룹에 피드가 존재하지 않습니다.');
      }
      setModalVisible(false);
    },
    [navigation]
  );

  useEffect(() => {
    if (!hasAnimated.current && mapRef.current) {
      const isInitial =
        typeof initialLatitude === 'number' && typeof initialLongitude === 'number';
      if (isInitial) {
        const region = {
          latitude: defaultLat,
          longitude: defaultLon,
          latitudeDelta: INIT_DELTA,
          longitudeDelta: INIT_DELTA,
        };
        mapRef.current.animateToRegion(region, 1000);
        setRegionManually(region);
      } else {
        requestUserLocation();
      }
      hasAnimated.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLat, defaultLon, requestUserLocation, setRegionManually]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        onRegionChangeComplete={setCurrentRegion}
      >
        <SearchMarkers data={searchData} onClusterPress={handleClusterPress} />
        <SearchRadius center={currentRegion} delta={currentRegion.latitudeDelta} fillColor={fillColor} />
      </MapView>

      <View style={styles.searchArea}>
        <SearchBar query={query} onChangeQuery={setQuery} onSearch={handleSearch} />
        {!modalVisible && (
          <AutoCompleteResultList
            results={results}
            isLoading={isLoading}
            onSelect={handleSelectAutoComplete}
          />
        )}
      </View>

      <RefetchButton
        onPress={() => {
          const radius = zoomToRadius(currentRegion.latitudeDelta);
          refetch(currentRegion.latitude, currentRegion.longitude, radius);
          triggerRadiusBlink();
          setRegionManually(currentRegion);
        }}
      />

      <UserLocationButton onPress={requestUserLocation} />
      <BackSwipeArea />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      )}
      {!loading && searchData.length === 0 && (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessageText}>이 지역에는 등록된 식당이 없습니다.</Text>
        </View>
      )}

      <ClusterModal
        visible={modalVisible}
        data={clusterData}
        onClose={() => setModalVisible(false)}
        onPlay={handlePlay}
        onComment={handleComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  emptyMessageContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 12,
    zIndex: 100,
  },
  emptyMessageText: {
    fontSize: 14,
    color: '#555',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  searchArea: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  backButton: {
    position: 'absolute',
    top: 46,
    left: 16,
    zIndex: 200,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
});

export default MapScreen;
