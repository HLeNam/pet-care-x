import { useInfiniteQuery } from '@tanstack/react-query';
import staffApi from '~/apis/staff.api';
import type { Employee } from '~/types/employee.type';
import type { DoctorAvailableItemResponse } from '~/types/employee.type';

type UseDoctorsAvailableInfiniteParams = {
  branchId: number | null;
  date: string;
  time: string;
  pageSize?: number;
};

/**
 * Hook để lấy danh sách bác sĩ rảnh với infinite scroll
 * Sử dụng useInfiniteQuery để hỗ trợ pagination
 */
export const useDoctorsAvailableInfinite = ({
  branchId,
  date,
  time,
  pageSize = 20
}: UseDoctorsAvailableInfiniteParams) => {
  return useInfiniteQuery({
    queryKey: ['doctors-available-infinite', branchId, date, time, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      if (!branchId || !date || !time) {
        return {
          items: [],
          currentPage: 1,
          totalPage: 0,
          totalItems: 0
        };
      }

      const response = await staffApi.getDoctorsAvailable({
        idChiNhanh: branchId,
        ngayHen: date,
        gioBatDau: time,
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

      // Transform API response sang Employee type
      const doctors: Employee[] = data.items.map((item: DoctorAvailableItemResponse) => ({
        employee_id: item.idBacSi,
        employee_code: `DOC${String(item.idBacSi).padStart(3, '0')}`,
        name: item.tenBacSi,
        gender: 'Nam',
        position: 1,
        branch_id: branchId
      }));

      return {
        items: doctors,
        currentPage: data.pageNo,
        totalPage: data.totalPage,
        totalItems: data.totalElements || 0
      };
    },
    getNextPageParam: (lastPage) => {
      // Nếu còn page tiếp theo thì return page number
      if (lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined; // Không còn page nào nữa
    },
    initialPageParam: 1,
    enabled: !!branchId && !!date && !!time,
    staleTime: 2 * 60 * 1000, // Cache 2 phút
    gcTime: 5 * 60 * 1000 // Giữ cache 5 phút
  });
};
