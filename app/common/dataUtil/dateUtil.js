// 날짜 포맷팅 함수: 년-월-일 시:분 형식으로 반환
export function formatDate(dateString, format = 'yyyy-MM-dd HH:mm') {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
  
    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hour)
      .replace('mm', minute);
  }


export function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}년 전`;
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}달 전`;
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}일 전`;
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}시간 전`;
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}분 전`;
  
    return `${seconds}초 전`;
  }
  
  