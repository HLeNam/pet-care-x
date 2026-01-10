import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  const updateParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });

        return newParams;
      });
    },
    [setSearchParams]
  );

  const getParam = useCallback(
    (key: string, defaultValue?: string) => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams]
  );

  return { params, updateParams, getParam };
};

export default useQueryParams;
