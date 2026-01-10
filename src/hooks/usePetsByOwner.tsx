import { useQuery } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';
import type { Pet, GetPetsByOwnerIdItemResponse } from '~/types/pet.type';

interface UsePetsByOwnerParams {
  idKhachHang: number | null;
  enabled?: boolean;
}

/**
 * Hook để lấy danh sách thú cưng theo owner ID
 * Loop qua tất cả các page để đảm bảo lấy hết 100% data
 */
export const usePetsByOwner = ({ idKhachHang, enabled = true }: UsePetsByOwnerParams) => {
  return useQuery({
    queryKey: ['pets', 'by-owner', idKhachHang],
    queryFn: async () => {
      if (!idKhachHang) {
        return [];
      }

      const allPets: GetPetsByOwnerIdItemResponse[] = [];
      let currentPage = 1; // API yêu cầu pageNo phải > 0
      let totalPages = 1;

      // Loop qua tất cả các page cho đến khi lấy hết
      while (currentPage <= totalPages) {
        const response = await petApi.getPetByOwnerId({
          idKhachHang,
          pageNo: currentPage,
          pageSize: 20 // Page size hợp lý cho mỗi request
        });

        const data = response.data.data;

        if (data && data.items) {
          allPets.push(...data.items);
          totalPages = data.totalPage;
        } else {
          break;
        }

        currentPage++;
      }

      // Transform API response sang Pet type để tương thích với code hiện tại
      const pets: Pet[] = allPets.map((item) => ({
        pet_id: item.idThuCung,
        pet_code: item.maThuCung,
        name: item.ten,
        species: '', // API không trả về, để trống
        breed: '', // API không trả về, để trống
        gender: 'Male', // API không trả về, giá trị mặc định
        birth_date: '', // API không trả về, để trống
        health_status: '', // API không trả về, để trống
        owner_id: idKhachHang
      }));

      return pets;
    },
    enabled: enabled && idKhachHang !== null,
    staleTime: 2 * 60 * 1000, // Cache 2 phút
    gcTime: 5 * 60 * 1000 // Giữ cache 5 phút
  });
};
