import { useInfiniteQuery } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';
import { useAppContext } from '~/contexts/app/app.context';
import type { Pet, GetPetsByOwnerIdItemResponse } from '~/types/pet.type';

interface UsePetListInfiniteParams {
  pageSize?: number;
}

/**
 * Hook to get pets by owner ID with infinite scroll
 * Dành cho user (owner) để xem danh sách pet của mình
 */
export const usePetListInfinite = ({ pageSize = 20 }: UsePetListInfiniteParams = {}) => {
  const { profile } = useAppContext();

  return useInfiniteQuery({
    queryKey: ['pets-infinite', 'by-owner', profile!.userId, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      if (!profile?.userId) {
        return {
          items: [],
          currentPage: 1,
          totalPage: 0,
          totalItems: 0
        };
      }

      const response = await petApi.getPetByOwnerId({
        idKhachHang: profile.userId,
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

      // Transform API response to Pet type
      const pets: Pet[] = data.items.map((item: GetPetsByOwnerIdItemResponse) => ({
        pet_id: item.idThuCung,
        pet_code: item.maThuCung,
        name: item.ten,
        species: '',
        breed: '',
        gender: 'Male',
        birth_date: '',
        health_status: '',
        owner_id: profile.userId
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
    enabled: !!profile?.userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};
