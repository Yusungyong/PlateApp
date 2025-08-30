// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { profileBucket } from '../../../auth/config';
// import { formatDistanceToNow } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import VideoMoreOptionsModal from '../../FeedComponents/VideoItem/videoItem/VideoMoreOptionsModal';
// import ReportReasonModal from '../../FeedComponents/FeedItem/ReportReasonModal';
// import { useSubmitReport } from '../../FeedComponents/FeedItem/useSubmitReport';

// interface Reply {
//   username: string;
//   commentText: string;
//   updatedAt: string;
//   profileImageUrl: string;
// }

// interface ReplyComponentProps {
//   commentId: number;
// }

// const formatUpdateTime = (updatedAt: string) => {
//   const date = new Date(updatedAt);
//   return formatDistanceToNow(date, { addSuffix: true, locale: ko });
// };

// const ReplyComponent: React.FC<ReplyComponentProps> = ({ commentId }) => {
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [optionsVisible, setOptionsVisible] = useState(false);
//   const [reportModalVisible, setReportModalVisible] = useState(false);
//   const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
//   const [currentUsername, setCurrentUsername] = useState<string | null>(null);

//   const { submitReport } = useSubmitReport();

//   const fetchReplies = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = await AsyncStorage.getItem('Authorization');
//       const username = await AsyncStorage.getItem('username'); // ⬅️ 로그인 사용자 정보
//       setCurrentUsername(username);

//       if (!token) throw new Error('No token found');

//       const response = await fetch('https://foodplayserver.shop/get-reply', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ commentId }),
//       });

//       if (!response.ok) throw new Error('Failed to fetch replies');
//       const data = await response.json();

//       setReplies(data.map((reply: Reply) => ({
//         username: reply.username,
//         commentText: reply.commentText,
//         updatedAt: formatUpdateTime(reply.updatedAt),
//         profileImageUrl: reply.profileImageUrl,
//       })));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [commentId]);

//   useEffect(() => {
//     fetchReplies();
//   }, [fetchReplies]);

//   const handleReport = async (reason: string) => {
//     if (!selectedReply || !currentUsername) return;
//     console.log(replies);
//     await submitReport({
//       reporterUsername: currentUsername,
//       targetType: 'video-reply-comment',
//       targetId: commentId,
//       targetUsername: selectedReply.username,
//       reason,
//       submittedAt: new Date().toISOString(),
//     });

//     setReportModalVisible(false);
//   };

//   const handleBlock = () => {
//     setOptionsVisible(false);
//     Alert.alert('차단 완료', '이 사용자를 차단했습니다.');
//   };

//   if (isLoading) return <ActivityIndicator size="small" color="#0000ff" />;
//   if (error) return <Text style={styles.errorText}>{error}</Text>;

//   return (
//     <>
//       <FlatList
//         data={replies}
//         keyExtractor={(item, index) => `${commentId}-${index}`}
//         renderItem={({ item }) => (
//           <View style={styles.replyContainer}>
//             <View style={styles.userIcon}>
//               {item.profileImageUrl ? (
//                 <Image
//                   source={{ uri: `${profileBucket}${item.profileImageUrl}` }}
//                   style={styles.profileImage}
//                 />
//               ) : (
//                 <Icon name="account-circle" size={30} color="#888" />
//               )}
//             </View>
//             <View style={styles.replyContent}>
//               <View style={styles.replyHeader}>
//                 <Text style={styles.replyUsername}>{item.username}</Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedReply(item);
//                     setOptionsVisible(true);
//                   }}
//                 >
//                   <Icon name="dots-horizontal" size={18} color="#888" />
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.replyText}>{item.commentText}</Text>
//               <Text style={styles.replyDate}>{item.updatedAt}</Text>
//             </View>
//           </View>
//         )}
//       />

//       <VideoMoreOptionsModal
//         visible={optionsVisible}
//         onClose={() => setOptionsVisible(false)}
//         onReport={() => {
//           setOptionsVisible(false);
//           setTimeout(() => setReportModalVisible(true), 300);
//         }}
//         onBlock={handleBlock}
//       />

//       <ReportReasonModal
//         visible={reportModalVisible}
//         onClose={() => setReportModalVisible(false)}
//         onSubmit={handleReport}
//       />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   replyContainer: {
//     flexDirection: 'row',
//     padding: 5,
//     marginTop: 10,
//     borderColor: '#ddd',
//   },
//   userIcon: {
//     marginRight: 10,
//   },
//   profileImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//   },
//   replyContent: {
//     flex: 1,
//   },
//   replyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   replyUsername: {
//     fontWeight: 'bold',
//   },
//   replyDate: {
//     fontSize: 12,
//     color: '#888',
//     textAlign: 'right',
//   },
//   replyText: {
//     marginVertical: 5,
//     fontSize: 14,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//   },
// });

// export default ReplyComponent;
