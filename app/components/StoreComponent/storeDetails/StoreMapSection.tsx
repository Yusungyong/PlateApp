import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const StoreMapSection = ({ latitude, longitude, name }) =>
  latitude && longitude ? (
    <View style={styles.mapWrap}>
      <Text style={styles.sectionTitle}>위치</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }} title={name} />
      </MapView>
    </View>
  ) : null;

const styles = StyleSheet.create({
  mapWrap: {
    width: width * 0.92,
    marginBottom: 18,
  },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#555',
  },
});

export default StoreMapSection;
