import { useQuery } from '@tanstack/react-query';
import staffApi from '~/apis/staff.api';
import type { Employee } from '~/types/employee.type';
import type { DoctorAvailableItemResponse } from '~/types/employee.type';

type UseDoctorsAvailableParams = {
  branchId: number | null;
  date: string;
  time: string;
};

/**
 * Hook để lấy danh sách bác sĩ rảnh
 * Loop qua tất cả các page để đảm bảo lấy hết 100% data
 */
export const useDoctorsAvailable = ({ branchId, date, time }: UseDoctorsAvailableParams) => {
  return useQuery({
    queryKey: ['doctors-available', branchId, date, time],
    queryFn: async () => {
      if (!branchId || !date || !time) {
        return [];
      }

      const allDoctors: DoctorAvailableItemResponse[] = [];
      let currentPage = 1; // API yêu cầu pageNo phải > 0
      let totalPages = 1;

      // Loop qua tất cả các page cho đến khi lấy hết
      while (currentPage <= totalPages) {
        const response = await staffApi.getDoctorsAvailable({
          idChiNhanh: branchId,
          ngayHen: date,
          gioBatDau: time,
          pageNo: currentPage,
          pageSize: 20 // Page size hợp lý cho mỗi request
        });

        const data = response.data.data;

        if (data && data.items) {
          allDoctors.push(...data.items);
          totalPages = data.totalPage;
        } else {
          break;
        }

        currentPage++;
      }

      // Transform API response sang Employee type để tương thích với code hiện tại
      const doctors: Employee[] = allDoctors.map((item) => ({
        employee_id: item.idBacSi,
        employee_code: `DOC${String(item.idBacSi).padStart(3, '0')}`,
        name: item.tenBacSi,
        gender: 'Nam', // API không trả về, giá trị mặc định
        position: 1, // 1 = Bác sĩ
        branch_id: branchId
      }));

      return doctors;
    },
    enabled: !!branchId && !!date && !!time, // Chỉ fetch khi có đủ params
    staleTime: 2 * 60 * 1000, // Cache 2 phút (vì lịch bác sĩ có thể thay đổi)
    gcTime: 5 * 60 * 1000 // Giữ cache 5 phút
  });
};
