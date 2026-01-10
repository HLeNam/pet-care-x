import { useQuery } from '@tanstack/react-query';
import staffApi from '~/apis/staff.api';
import type { DoctorScheduleItemResponse } from '~/types/employee.type';

type UseDoctorScheduleParams = {
    doctorId: number | null;
    branchId: number | null;
};

/**
 * Hook để lấy lịch làm việc của bác sĩ trong 7 ngày tới
 * Loop qua tất cả các page để đảm bảo lấy hết 100% data
 */
export const useDoctorSchedule = ({ doctorId, branchId }: UseDoctorScheduleParams) => {
    return useQuery({
        queryKey: ['doctor-schedule', doctorId, branchId],
        queryFn: async () => {
            if (!doctorId || !branchId) {
                return [];
            }

            const allSchedule: DoctorScheduleItemResponse[] = [];
            let currentPage = 1;
            let totalPages = 1;

            // Loop qua tất cả các page cho đến khi lấy hết
            while (currentPage <= totalPages) {
                const response = await staffApi.getDoctorSchedule({
                    idBacSi: doctorId,
                    idChiNhanh: branchId,
                    pageNo: currentPage,
                    pageSize: 50
                });
                const data = response.data.data;

                if (data && Array.isArray(data)) {
                    allSchedule.push(...data);
                    totalPages = 1;
                } else {
                    break;
                }

                currentPage++;
            }
            return allSchedule;
        },
        enabled: !!doctorId && !!branchId, // Chỉ fetch khi có đủ params
        staleTime: 2 * 60 * 1000, // Cache 2 phút (vì lịch có thể thay đổi)
        gcTime: 5 * 60 * 1000 // Giữ cache 5 phút
    });
};
