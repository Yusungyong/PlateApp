import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PlateImageSlider from './PlateImageSlider';
import ExpandableText from './ExpandableText';
import TasteTagList from './TasteTagList';
import PlateMetaInfo from './PlateMetaInfo';
import CommentSection from '../../../FeedComponents/CommentsSection/feed/CommentSection';
import ClusterBottomModal from '../../../FeedComponents/FeedItem/ClusterBottomModal';
import FeedActionModal, { FeedAction } from './FeedActionModal';
import { useDeleteFeed } from './useDeleteFeed';
import { FeedItem } from './types';

interface Props {
  feed: FeedItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: (feedId: number) => void;
  onDeleteSuccess?: (deletedFeedId: number) => void;
}

const PlateCard: React.FC<Props> = ({
  feed,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDeleteSuccess,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { deleteFeed } = useDeleteFeed();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleMorePress = () => setShowOptionsModal(true);

  const handleDelete = async () => {
    const success = await deleteFeed(feed.feedId);
    if (success) {
      setShowOptionsModal(false);
      onDeleteSuccess?.(feed.feedId);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      '정말 삭제하시겠어요?',
      '이 피드를 삭제하면 좋아요, 태그, 댓글, 함께 방문한 친구 등\n모든 관련 정보가 복구되지 않습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제하기', onPress: handleDelete, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleShare = (feed: FeedItem) => {
    console.log('📤 공유하기:', feed.feedId);
    // TODO: Share API 연결 예정
  };

  const modalActions: FeedAction[] = [
    // {
    //   label: '수정하기',
    //   onPress: () => onEdit?.(feed.feedId),
    //   icon: 'create-outline',
    // },
    // {
    //   label: '공유하기',
    //   onPress: () => handleShare(feed),
    //   icon: 'share-social-outline',
    // },
    // {
    //   label: '신고하기',
    //   onPress: () => setShowReportModal(true),
    //   icon: 'alert-circle-outline',
    // },
    {
      label: '삭제하기',
      onPress: confirmDelete,
      icon: 'trash-outline',
      danger: true,
    },
  ];

  return (
    <View style={styles.feedItem}>
      <View style={styles.headerRow}>
        <View />
        <TouchableOpacity onPress={handleMorePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <PlateImageSlider images={feed.images} />
      <ExpandableText text={feed.content} expanded={isExpanded} onToggle={onToggleExpand} />
      <TasteTagList tags={feed.tasteTags ?? []} />

      {feed.friendNames?.length > 0 && (
        <Text style={styles.friendsText}>
          <Text style={{ fontWeight: 'bold' }}>
            {feed.friendNames.length === 1
              ? `${feed.friendNames[0]}님과 함께 다녀온`
              : `${feed.friendNames[0]}님 외 ${feed.friendNames.length - 1}명과 함께 다녀온 `}
          </Text>
        </Text>
      )}

      {(feed.location || feed.storeName) && (
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            {feed.location ? `${feed.location.split(' ').slice(0, 2).join(' ')}의 ` : ''}
            {feed.storeName ? (
              <Text style={styles.storeNameInline}>{feed.storeName}</Text>
            ) : (
              <Text style={{ color: '#aaa' }}>가게 정보 없음</Text>
            )}
          </Text>
        </View>
      )}

      <View style={styles.bottomRow}>
        <PlateMetaInfo
          likeCount={feed.likeCount}
          commentCount={feed.commentCount}
          onLikePress={() => setShowLikesModal(true)}
          onCommentPress={() => setShowComments(prev => !prev)}
        />
        <Text style={styles.timestamp}>접시 비운 날 · {formatDate(feed.createdAt)}</Text>
      </View>

      {showComments && (
        <View style={{ marginTop: 12 }}>
          <CommentSection id={feed.feedId} type="feed" />
        </View>
      )}

      <ClusterBottomModal
        visible={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        feedId={feed.feedId}
        storeId={feed.storeId}
      />

      <FeedActionModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        actions={modalActions}
      />
    </View>
  );
};

export default PlateCard;

const styles = StyleSheet.create({
  feedItem: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  friendsText: {
    fontSize: 13,
    color: '#444',
    marginTop: 6,
    fontStyle: 'italic',
  },
  locationRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationText: {
    fontSize: 13,
    color: '#555',
  },
  storeNameInline: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    paddingTop: 2,
  },
});