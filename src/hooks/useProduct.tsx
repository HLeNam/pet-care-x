import { useQuery } from '@tanstack/react-query';
import productApi from '~/apis/product.api';
import type { ProductListParams, MedicineItemResponse } from '~/types/product.type';

interface UseSearchMedicinesParams extends ProductListParams {
  enabled?: boolean;
}

/**
 * Hook to search medicines with real-time query
 */
export const useSearchMedicines = ({
  keyword,
  pageNo = 0,
  pageSize = 10,
  enabled = true
}: UseSearchMedicinesParams) => {
  const query = useQuery({
    queryKey: ['medicines', 'search', keyword, pageNo, pageSize],
    queryFn: () => productApi.searchMedicines({ keyword, pageNo, pageSize }),
    enabled: enabled && !!keyword && keyword.trim().length > 0,
    staleTime: 30 * 1000, // Cache 30 seconds
    gcTime: 2 * 60 * 1000 // Keep cache 2 minutes
  });

  const medicines: MedicineItemResponse[] = query.data?.data?.data?.items || [];

  return {
    medicines,
    pagination: {
      pageNo: query.data?.data?.data?.pageNo || pageNo,
      pageSize: query.data?.data?.data?.pageSize || pageSize,
      totalPage: query.data?.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.data?.totalElements || 0
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
