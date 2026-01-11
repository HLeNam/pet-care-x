import { useInfiniteQuery } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';
import type { Pet, GetPetsByOwnerIdItemResponse } from '~/types/pet.type';

interface UsePetsByOwnerInfiniteParams {
  idKhachHang: number | null;
  enabled?: boolean;
  pageSize?: number;
}

/**
 * Hook để lấy danh sách thú cưng theo owner ID với infinite scroll
 * Sử dụng useInfiniteQuery để hỗ trợ pagination
 */
export const usePetsByOwnerInfinite = ({
  idKhachHang,
  enabled = true,
  pageSize = 20
}: UsePetsByOwnerInfiniteParams) => {
  return useInfiniteQuery({
    queryKey: ['pets-infinite', 'by-owner', idKhachHang, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      if (!idKhachHang) {
        return {
          items: [],
          currentPage: 1,
          totalPage: 0,
          totalItems: 0
        };
      }

      const response = await petApi.getPetByOwnerId({
        idKhachHang,
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

      // Transform API response sang Pet type
      const pets: Pet[] = data.items.map((item: GetPetsByOwnerIdItemResponse) => ({
        pet_id: item.idThuCung,
        pet_code: item.maThuCung,
        name: item.ten,
        species: '',
        breed: '',
        gender: 'Male',
        birth_date: '',
        health_status: '',
        owner_id: idKhachHang
      }));

      return {
        items: pets,
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
    enabled: enabled && idKhachHang !== null,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
};
