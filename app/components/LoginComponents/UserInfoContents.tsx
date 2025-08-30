// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import secureStorage from '../../auth/secureStorage'; // 경로 맞게!
// import { apiUrl } from '../../auth/config'; // API URL 가져오기

// const UserInfoContents: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
//   const [userInfo, setUserInfo] = useState({
//     region: '',
//     createdAt: '',
//     username: '',
//     regCnt: ''
//   });

//   useEffect(() => {
//     const sendUsername = async () => {
//       try {
//         // ✅ secureStorage에서 accessToken 직접 읽기
//         const tokens = await secureStorage.getItem<{ accessToken: string }>('tokens');
//         const accessToken = tokens?.accessToken;

//         // username은 기존대로 AsyncStorage에서
//         const username = await AsyncStorage.getItem('username');

//         if (accessToken && username) {
//           const response = await fetch(`${apiUrl}userInfo2`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify({ username }), // username을 JSON 형태로 감싸서 보냄
//           });

//           if (!response.ok) {
//             throw new Error('네트워크 응답이 실패했습니다');
//           }

//           const data = await response.json();
//           setUserInfo({
//             region: data.region,
//             createdAt: data.createdAt,
//             username: data.username,
//             regCnt: data.regCnt
//           });
//         }
//       } catch (error) {
//         console.error('POST 요청 에러:', error);
//       }
//     };

//     sendUsername();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>사용자 정보</Text>
//       <View style={styles.infoContainer}>
//         <Text style={styles.info}>활동지역: {userInfo.region}</Text>
//         <Text style={styles.info}>가입일자: {userInfo.createdAt}</Text>
//         <Text style={styles.info}>사용자 이름: {userInfo.username}</Text>
//         <Text style={styles.info}>게시물: {userInfo.regCnt}</Text>
//       </View>
//       <Button title="로그아웃" onPress={onLogout} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//   },
//   infoContainer: {
//     alignSelf: 'flex-start',
//     marginBottom: 16,
//   },
//   info: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
// });

// export default UserInfoContents;
