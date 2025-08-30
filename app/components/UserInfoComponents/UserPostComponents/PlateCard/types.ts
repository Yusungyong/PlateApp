// components/PlateFeed/types.ts
export interface FeedItem {
  feedId: number;
  storeId: number;
  username: string;
  storeName: string;
  location?: string;
  images: string | null;
  tags?: string; // tasteTags로 파싱됨
  friendNames?: string; // 파싱됨
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;

  // 클라이언트 전용 필드 (전처리 후 생성됨)
  tasteTags?: string[];
  friendNamesParsed?: string[]; // name 충돌 피하려면 별도로 저장도 가능
}
