// searchAddress.ts
export const searchAddress = async (query: string): Promise<any[]> => {
    if (!query) {
      return [];
    }
    try {
      const response = await fetch(
        `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
          query
        )}&display=5`,
        {
          method: 'GET',
          headers: {
            'X-Naver-Client-Id': 'tRElJCITUUFGIKuF5m3M',
            'X-Naver-Client-Secret': 'OlHxBtV5c3',
          },
        }
      );
      const data = await response.json();
      return data.items.slice(0, 5); // 최대 5개 결과 반환
    } catch (error) {
      console.error('검색 오류: ', error);
      return [];
    }
  };
  