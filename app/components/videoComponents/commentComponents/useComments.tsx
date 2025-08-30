// import { useState, useEffect, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface Comment {
//   commentId: string;
//   username: string;
//   commentText: string;
//   updatedAt: string;
//   profileImageUrl: string;
// }

// const parseDate = (dateString: string | undefined): string => {
//   if (!dateString) {
//     return new Date().toISOString();
//   }
//   try {
//     const formattedDate = dateString.split('.')[0] + 'Z';
//     return new Date(formattedDate).toISOString();
//   } catch (error) {
//     console.error('Date parsing error:', error);
//     return new Date().toISOString();
//   }
// };

// export const useComments = (storeId: string) => {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchComments = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = await AsyncStorage.getItem('Authorization');
//       if (!token) throw new Error('No token found');

//       const response = await fetch(`https://foodplayserver.shop/get-comment?storeId=${storeId}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch comments');
//       const data = await response.json();
      
//       const parsedComments = data.map((comment: Comment) => ({
//         ...comment,
//         updatedAt: parseDate(comment.updatedAt)
//       }));
//       setComments(parsedComments);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [storeId]);

//   useEffect(() => {
//     fetchComments();
//   }, [fetchComments]);

//   const addComment = useCallback(async (commentText: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = await AsyncStorage.getItem('Authorization');
//       if (!token) throw new Error('No token found');
//       const username = await AsyncStorage.getItem('username');
//       if (!username) throw new Error('Username not found');

//       const response = await fetch('https://foodplayserver.shop/reg-comment', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, storeId, commentText }),
//       });

//       if (!response.ok) throw new Error('Failed to add comment');
      
//       await fetchComments();
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [storeId, fetchComments]);

//   return { comments, isLoading, error, addComment, fetchComments };
// };