import { useInfiniteQuery } from '@tanstack/react-query';
import branchApi from '~/apis/branch.api';
import type { Branch, BranchItemResponse } from '~/types/branch.type';

interface UseBranchListInfiniteParams {
  pageSize?: number;
}

/**
 * Hook để lấy danh sách chi nhánh với infinite scroll
 * Sử dụng useInfiniteQuery để hỗ trợ pagination
 */
export const useBranchListInfinite = ({ pageSize = 20 }: UseBranchListInfiniteParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['branches-infinite', pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await branchApi.getBranchList({
        pageNo: pageParam,
        pageSize: pageSize
      });

      const data = response.data.data;

      if (!data || !data.items) {
        return {
          items: [],
          currentPage: pageParam,
          totalPage: 0,
          totalItems: 0
        };
      }

      // Transform API response sang Branch type
      const branches: Branch[] = data.items.map((item: BranchItemResponse) => ({
        branch_id: item.idChiNhanh,
        branch_code: `BR${String(item.idChiNhanh).padStart(3, '0')}`,
        name: item.tenChiNhanh,
        address: '',
        phone: '',
        open_time: '08:00',
        close_time: '20:00'
      }));

      return {
        items: branches,
        currentPage: data.pageNo,
        totalPage: data.totalPage,
        totalItems: data.totalElements || 0
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};
