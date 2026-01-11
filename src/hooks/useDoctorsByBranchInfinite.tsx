import { useInfiniteQuery } from '@tanstack/react-query';
import staffApi from '~/apis/staff.api';
import type { Employee } from '~/types/employee.type';
import type { DoctorByBranchItemResponse } from '~/types/employee.type';

/**
 * Hook để lấy danh sách bác sĩ theo chi nhánh với infinite scroll
 * Sử dụng useInfiniteQuery để hỗ trợ pagination
 */
export const useDoctorsByBranchInfinite = (branchId: number | null, pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['doctors-by-branch-infinite', branchId, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      if (!branchId) {
        return {
          items: [],
          currentPage: 1,
          totalPage: 0,
          totalItems: 0
        };
      }

      const response = await staffApi.getDoctorsByBranch({
        idChiNhanh: branchId,
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

      // Transform sang Employee type
      const doctors: Employee[] = data.items.map((item: DoctorByBranchItemResponse) => ({
        employee_id: item.idBacSi,
        employee_code: `DOC${String(item.idBacSi).padStart(3, '0')}`,
        name: item.tenBacSi,
        gender: 'Nam',
        position: 1,
        branch_id: branchId
      }));

      return {
        items: doctors,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        totalItems: data.totalItems || 0
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!branchId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
};
