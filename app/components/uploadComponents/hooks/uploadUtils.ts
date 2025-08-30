// uploadUtils.ts
import { geoCodingApiKey } from '../../../config/config';

export const getGeocodeData = async (address: string, username: string) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geoCodingApiKey}`
  );
  const json = await res.json();
  if (json.status !== 'OK') throw new Error('주소 변환 실패');

  return {
    latitude: json.results[0].geometry.location.lat,
    longitude: json.results[0].geometry.location.lng,
    formattedAddress: json.results[0].formatted_address,
    placeId: json.results[0].place_id,
    username,
  };
};

interface PrepareFormDataParams {
  file: any;
  thumbnail: any;
  storeName: string;
  storeAddress: string;
  storeTel: string;
  description: string;
  selectedFriends: { friendName: string }[];
  removeAudio: boolean;
  username: string;
}

export const prepareFormData = ({
  file,
  thumbnail,
  storeName,
  storeAddress,
  storeTel,
  description,
  selectedFriends,
  removeAudio,
  username,
}: PrepareFormDataParams): FormData => {
  const formData = new FormData();
  formData.append('file', {
    name: file.fileName || 'video.mp4',
    type: file.type,
    uri: file.uri,
  });

  if (thumbnail) {
    formData.append('thumbnail', {
      name: 'thumbnail.jpg',
      type: 'image/jpeg',
      uri: thumbnail,
    });
  }

  formData.append('title', storeName);
  formData.append('storeName', storeName);
  formData.append('restaurantAddress', storeAddress);
  formData.append('storeTelNo', storeTel);
  formData.append('description', description);
  formData.append('friend', selectedFriends.map((f) => f.friendName).join(', '));
  formData.append('removeAudio', removeAudio.toString());
  formData.append('username', username);

  return formData;
};
