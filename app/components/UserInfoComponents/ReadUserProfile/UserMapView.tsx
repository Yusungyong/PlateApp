import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

interface UserMapViewProps {
  latitude: number;
  longitude: number;
  regionName?: string;
  markerLabel?: string;
}

const UserMapView: React.FC<UserMapViewProps> = ({
  latitude,
  longitude,
  regionName,
  markerLabel,
}) => {
  const [currentRegion, setCurrentRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });
  const [locationLoaded, setLocationLoaded] = useState(false);
  console.log('UserMapView mounted with props:');
  useEffect(() => {
    
    const requestLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '위치 권한 필요',
              message: '지도를 위해 위치 권한이 필요합니다.',
              buttonNeutral: '나중에',
              buttonNegative: '취소',
              buttonPositive: '허용',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setLocationLoaded(true);
            return;
          }
        }
        Geolocation.getCurrentPosition(
          position => {
            setCurrentRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0121,
            });
            setLocationLoaded(true);
          },
          error => {
            // 권한 거부/실패 시 fallback 사용
            setLocationLoaded(true);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        );
      } catch (err) {
        setLocationLoaded(true);
      }
    };
    requestLocation();
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      {/* 지도만 먼저 그리고, 위치 권한 거부 등에도 fallback */}
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        region={currentRegion} // region props로 고정하면 마커 따라가기 쉬움
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          }}
          title={markerLabel || regionName || '내 위치'}
          description={regionName}
        />
      </MapView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 260,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 18,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: 260,
    minHeight: 240,
  },
});

export default UserMapView;
