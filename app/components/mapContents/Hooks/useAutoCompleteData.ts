import { useMemo } from 'react';
import { useAutoCompleteSource } from './useAutoCompleteSource'

type AutoCompleteItem = {
  id: number;
  title: string;
  store_name: string;
  latitude: number;
  longitude: number;
  tags: string | null;
  type: 'video' | 'feed';
};

export const useAutoCompleteData = (query: string) => {
  const { source, loading } = useAutoCompleteSource(); // ✅ 수정됨

  const results: AutoCompleteItem[] = useMemo(() => {
    if (!query || !source) return [];
    const lowerQuery = query.toLowerCase();

    return source.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.storeName?.toLowerCase().includes(lowerQuery) ||
        item.tags?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, source]); // ✅ 수정됨

  return { results, isLoading: loading }; // ✅ loading 이름 일치
};
