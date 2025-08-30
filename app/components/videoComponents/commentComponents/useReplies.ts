// // useReplies.ts
// import { useState, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export interface Reply {
//   username: string;
//   commentText: string;
//   updatedAt: string;
//   profileImageUrl?: string;
// }

// export const useReplies = (commentId: number) => {
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentUsername, setCurrentUsername] = useState('');

//   const formatUpdateTime = (isoString: string) => {
//     const date = new Date(isoString);
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0');
//     const dd = String(date.getDate()).padStart(2, '0');
//     const hh = String(date.getHours()).padStart(2, '0');
//     const mi = String(date.getMinutes()).padStart(2, '0');
//     return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
//   };

//   const fetchReplies = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const token = await AsyncStorage.getItem('Authorization');
//       const username = await AsyncStorage.getItem('username');
//       setCurrentUsername(username || '');

//       if (!token) throw new Error('No token found');

//       const response = await fetch('https://foodplayserver.shop/get-reply', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ commentId }),
//       });

//       if (!response.ok) throw new Error('Failed to fetch replies');

//       const data = await response.json();

//       setReplies(
//         data.map((reply: any) => ({
//           username: reply.username,
//           commentText: reply.commentText,
//           updatedAt: formatUpdateTime(reply.updatedAt),
//           profileImageUrl: reply.profileImageUrl,
//         }))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [commentId]);

//   return {
//     replies,
//     isLoading,
//     error,
//     currentUsername,
//     fetchReplies,
//   };
// };
