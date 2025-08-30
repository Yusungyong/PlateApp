import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import ThumbnailSection from './ThumbnailSection/ThumbnailSection';
import MenuRecommendation from './HomeFavImages/MenuRoulette';
import NewsSection from './NewsSection';
import GridComponent from './NewsEditor/GridComponent';
import { requestAndFetchLocation } from '../../common/locationUtils';
import CommonLayout from '../../common/CommonLayout';

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationChecked, setLocationChecked] = useState(false);
  
  useEffect(() => {
    const fetchLocation = async () => {
      await requestAndFetchLocation(setLocation, setLocationError);
      setLocationChecked(true);
    };
    fetchLocation();
  }, []);

  if (!locationChecked) {
    return (
      <CommonLayout>
        <ActivityIndicator size="large" />
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {locationError && (
          <Text style={styles.locationErrorText}>{locationError}</Text>
        )}

        <MenuRecommendation />
        <ThumbnailSection location={location} />
        {/* <GridComponent /> */}
        <NewsSection />
      </ScrollView>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  locationErrorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;
