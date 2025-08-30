// app/notifications/navigateFromNotification.ts
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigationRef, navigateSafely } from '../navigation/navigationRef';
import { parseNotiData } from './notiTypes';

/** 알림 payload를 파싱해 안전하게 네비게이션 */
export function navigateFromNotification(remoteMessage?: FirebaseMessagingTypes.RemoteMessage) {
  const parsed = parseNotiData(remoteMessage?.data);
  if (!parsed) return;

  navigateSafely(() => {
    switch (parsed.type) {
      case 'video':
        navigationRef.navigate('재생' as never, {
          storeId: Number(parsed.referenceId),
          passedUsername: 'noti',
          ...(parsed.commentId ? { scrollToCommentId: Number(parsed.commentId) } : {}),
          ...(parsed.replyId ? { scrollToReplyId: Number(parsed.replyId) } : {}),
        } as never);
        break;

      case 'feed':
        navigationRef.navigate('FeedImageViewer' as never, {
          feedId: Number(parsed.referenceId),
          username: parsed.receiverId,
          ...(parsed.commentId ? { scrollToCommentId: Number(parsed.commentId) } : {}),
          ...(parsed.replyId ? { scrollToReplyId: Number(parsed.replyId) } : {}),
        } as never);
        break;

      default:
        // no-op
        break;
    }
  });
}
