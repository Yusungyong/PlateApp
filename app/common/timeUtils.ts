// utils/timeUtils.ts

/**
 * 생성된 시간을 받아서 "2분 전", "1시간 전" 등으로 변환하는 함수
 * @param createdAt 생성된 시간 (ISO string 또는 timestamp)
 * @returns 변환된 시간 문자열
 */
export const timeAgo = (createdAt: string | number): string => {
    const createdTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - createdTime) / 1000); // 초 단위 차이 계산
  
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
    if (diff < 31104000) return `${Math.floor(diff / 2592000)}달 전`;
    return `${Math.floor(diff / 31104000)}년 전`;
  };