import { useState } from 'react';
import { geoCodingApiKey } from '../config/config';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocodeData, setGeocodeData] = useState<any>(null);
  const apiKey = geoCodingApiKey;

  const geocodeAddress = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setGeocodeData(data);
        setIsLoading(false);
      
        if (!data) {
          setIsLoading(false);
          Alert.alert('오류', '주소를 지오코딩할 수 없습니다');
          return false;
        }
        const addressComponents = data.results[0].address_components;
        // 이후 data를 이용해서 gData 구성
        const gData = {
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng,
          formattedAddress: data.results[0].formatted_address,
          placeId: data.results[0].place_id,
          streetNumber: getAddressComponent(addressComponents, 'street_number'),
          route: getAddressComponent(addressComponents, 'route'),
          locality: getAddressComponent(addressComponents, 'locality'),
          administrativeAreaLevel1: getAddressComponent(addressComponents, 'administrative_area_level_1'),
          administrativeAreaLevel2: getAddressComponent(addressComponents, 'administrative_area_level_2'),
          country: getAddressComponent(addressComponents, 'country'),
          postalCode: getAddressComponent(addressComponents, 'postal_code'),
          username: username,
        };
        
        return gData;
      } else {
        throw new Error(`Geocoding API error: ${data.status}`);
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      setError(error.message || 'Unknown error occurred');
      setIsLoading(false);
      return null;
    }
  };

  const getAddressComponent = (components: any[], type: string) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : '';
  };


  return {
    isLoading,
    error,
    geocodeData,
    geocodeAddress,
    getAddressComponent,
  };
};

export default useGeocoding;
