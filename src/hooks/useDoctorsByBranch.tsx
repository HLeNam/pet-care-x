import { useQuery } from '@tanstack/react-query';
import staffApi from '~/apis/staff.api';
import type { Employee } from '~/types/employee.type';
import type { DoctorByBranchItemResponse } from '~/types/employee.type';

/**
 * Hook để lấy danh sách bác sĩ theo chi nhánh
 * Loop qua tất cả các page để đảm bảo lấy hết 100% data
 */
export const useDoctorsByBranch = (branchId: number | null) => {
    return useQuery({
        queryKey: ['doctors-by-branch', branchId],
        queryFn: async () => {
            if (!branchId) {
                return [];
            }

            const allDoctors: DoctorByBranchItemResponse[] = [];
            let currentPage = 1;
            let totalPages = 1;

            // Loop qua tất cả các page cho đến khi lấy hết
            while (currentPage <= totalPages) {
                const response = await staffApi.getDoctorsByBranch({
                    idChiNhanh: branchId,
                    pageNo: currentPage,
                    pageSize: 20
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

            // Transform sang Employee type để tương thích với code hiện tại
            const doctors: Employee[] = allDoctors.map((item) => ({
                employee_id: item.idBacSi,
                employee_code: `DOC${String(item.idBacSi).padStart(3, '0')}`,
                name: item.tenBacSi,
                gender: 'Nam',
                position: 1, // 1 = Bác sĩ
                branch_id: branchId
            }));

            return doctors;
        },
        enabled: !!branchId,
        staleTime: 5 * 60 * 1000, // Cache 5 phút
        gcTime: 10 * 60 * 1000
    });
};
