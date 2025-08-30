// app/notifications/notiTypes.ts
export type NotiData = {
  type: 'video' | 'feed';
  referenceId: string;
  receiverId?: string;
  commentId?: string;
  replyId?: string;
};

/** 런타임 파서: 구조/타입 느슨 검증 후 NotiData로 변환, 실패 시 null */
export function parseNotiData(data: any): NotiData | null {
  if (!data || typeof data !== 'object') return null;
  if (!('type' in data) || !('referenceId' in data)) return null;

  const type = String((data as any).type);
  if (type !== 'video' && type !== 'feed') return null;

  return {
    type,
    referenceId: String((data as any).referenceId),
    receiverId: (data as any).receiverId ? String((data as any).receiverId) : undefined,
    commentId: (data as any).commentId ? String((data as any).commentId) : undefined,
    replyId: (data as any).replyId ? String((data as any).replyId) : undefined,
  };
}
