import { useQuery } from '@tanstack/react-query';
import branchApi from '~/apis/branch.api';
import type { Branch, BranchItemResponse } from '~/types/branch.type';

/**
 * Hook để lấy danh sách chi nhánh
 * Loop qua tất cả các page để đảm bảo lấy hết 100% data
 */
export const useBranchList = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const allBranches: BranchItemResponse[] = [];
      let currentPage = 1; // API yêu cầu pageNo phải > 0
      let totalPages = 1;

      // Loop qua tất cả các page cho đến khi lấy hết
      while (currentPage <= totalPages) {
        const response = await branchApi.getBranchList({
          pageNo: currentPage,
          pageSize: 20 // Page size hợp lý cho mỗi request
        });

        const data = response.data.data;

        if (data && data.items) {
          allBranches.push(...data.items);
          totalPages = data.totalPage;
        } else {
          break;
        }

        currentPage++;
      }

      // Transform API response sang Branch type để tương thích với code hiện tại
      const branches: Branch[] = allBranches.map((item) => ({
        branch_id: item.idChiNhanh,
        branch_code: `BR${String(item.idChiNhanh).padStart(3, '0')}`,
        name: item.tenChiNhanh,
        address: '', // API không trả về, để trống
        phone: '', // API không trả về, để trống
        open_time: '08:00', // Giá trị mặc định
        close_time: '20:00' // Giá trị mặc định
      }));

      return branches;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút vì danh sách chi nhánh ít thay đổi
    gcTime: 10 * 60 * 1000 // Giữ cache 10 phút
  });
};
