import { useState, useEffect, useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';

interface Comment {
  commentId: number;
  feedId: number;
  username: string;
  content: string;
  createdAt: string;
  profileImageUrl: string; 
}

export const useFetchComments = (feedId: number) => {
  const { apiCall } = useApiService();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!feedId) return;

    setLoading(true);
    setError(null);

    try {
      // 서버에서 댓글 목록 가져오기
      const response = await apiCall<Comment[]>({
        method: 'POST',
        url: 'feed-comment-list', // 실제 엔드포인트에 맞게 수정
        data: { feedId },
      });

      setComments(response);
    } catch (err) {
      console.error('댓글을 불러오는 중 오류 발생:', err);
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [feedId]); // apiCall을 의존성에서 제거

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // fetchComments가 feedId에만 의존하므로, feedId가 바뀔 때만 실행됨

  return { comments, loading, error, fetchComments };
};
