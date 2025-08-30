// UserLocationHandler.js
import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';

const UserLocationHandler = ({ mapRef }) => {
  // 현재 위치로 이동하는 함수
  const goToCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        if (mapRef && mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      },
      (error) => {
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, [mapRef]);

  // 컴포넌트 마운트 시 현재 위치로 이동
  useEffect(() => {
    goToCurrentLocation();
  }, [goToCurrentLocation]);

  return (
    <TouchableOpacity style={styles.locationButton} onPress={goToCurrentLocation}>
      <Icon name="my-location" size={30} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 25,
    elevation: 5, // 안드로이드 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default React.memo(UserLocationHandler);
