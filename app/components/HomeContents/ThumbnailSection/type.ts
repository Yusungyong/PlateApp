export interface ThumbnailItem {
  storeId: number;
  placeId: string;
  title: string;
  thumbnail: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  menuCnt: number;
  videoDuration?: number; // 초 단위 (예: 78 → 1분 18초)
}
