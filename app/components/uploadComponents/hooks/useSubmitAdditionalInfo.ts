// import { useState } from 'react';
// import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { apiUrl } from '../../auth/config';

// export const useSubmitAdditionalInfo = () => {
//   const [loading, setLoading] = useState(false);

//   const submitAdditionalInfo = async (
//     storeId: string | null, 
//     username: string | null, 
//     parkingAvailable: string, 
//     visualScore: number, 
//     tasteScore: number, 
//     serviceScore: number
//   ) => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const token = await AsyncStorage.getItem('Authorization');
//       if (!token) {
//         Alert.alert('오류', '토큰을 찾을 수 없습니다.');
//         setLoading(false);
//         return false;
//       }

//       const response = await fetch(`${apiUrl}store-info-upload-2`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           storeId,
//           username,
//           parking: parkingAvailable,
//           visual: visualScore,
//           taste: tasteScore,
//           service: serviceScore
//         })
//       });

//       if (response.ok) {
//         Alert.alert('성공', '성공적으로 저장되었습니다!');
//         setLoading(false);
//         return true;
//       } else {
//         Alert.alert('오류', '저장에 실패하였습니다.');
//         setLoading(false);
//         return false;
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('오류', '오류가 발생하였습니다.');
//       setLoading(false);
//       return false;
//     }
//   };

//   return { submitAdditionalInfo, loading };
// };
