import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';
import { useAppContext } from '~/contexts/app/app.context';
import type {
  GetPetsByOwnerIdItemResponse,
  Pet,
  CreatePetParams,
  UpdatePetParams,
  DeletePetParams
} from '~/types/pet.type';

interface UsePetListParams {
  pageNo?: number;
  pageSize?: number;
}

/**
 * Hook to get pets by owner ID
 */
export const usePetList = ({ pageNo = 1, pageSize = 20 }: UsePetListParams = {}) => {
  const { profile } = useAppContext();

  const query = useQuery({
    queryKey: ['pets', 'by-owner', profile!.idAccount, pageNo, pageSize],
    queryFn: () =>
      petApi.getPetByOwnerId({
        idKhachHang: profile!.idAccount,
        pageNo,
        pageSize
      }),
    enabled: !!profile?.idAccount,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const allPets: GetPetsByOwnerIdItemResponse[] = query.data?.data?.data?.items || [];
  const pets: Pet[] = allPets.map((item) => ({
    pet_id: item.idThuCung,
    pet_code: item.maThuCung,
    name: item.ten,
    species: '', // API không trả về, để trống
    breed: '', // API không trả về, để trống
    gender: 'Male', // API không trả về, giá trị mặc định
    birth_date: '', // API không trả về, để trống
    health_status: '', // API không trả về, để trống
    owner_id: profile!.idAccount
  }));

  return {
    pets,
    pagination: {
      pageNo: query.data?.data?.data?.pageNo || 1,
      pageSize: query.data?.data?.data?.pageSize || pageSize,
      totalPage: query.data?.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.data?.totalElements || 0
    },
    isLoading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch
  };
};

export const usePetDetail = (petId: number | null) => {
  return useQuery({
    queryKey: ['pet-detail', petId],
    queryFn: () => petApi.getPetDetails({ idThuCung: petId! }),
    enabled: !!petId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Hook to create a new pet
 */
export const useCreatePet = () => {
  const queryClient = useQueryClient();
  const { profile } = useAppContext();

  return useMutation({
    mutationFn: (params: CreatePetParams) => petApi.createPet(params),
    onSuccess: () => {
      // Invalidate and refetch pets list
      queryClient.invalidateQueries({ queryKey: ['pets', 'by-owner', profile!.idAccount] });
    }
  });
};

/**
 * Hook to update pet information
 */
export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  const { profile } = useAppContext();

  return useMutation({
    mutationFn: (params: UpdatePetParams) => petApi.updatePet(params),
    onSuccess: (_, variables) => {
      // Invalidate pets list and specific pet detail
      queryClient.invalidateQueries({ queryKey: ['pets', 'by-owner', profile!.idAccount] });
      queryClient.invalidateQueries({ queryKey: ['pet-detail', variables.idThuCung] });
    }
  });
};

/**
 * Hook to delete a pet
 */
export const useDeletePet = () => {
  const queryClient = useQueryClient();
  const { profile } = useAppContext();

  return useMutation({
    mutationFn: (params: DeletePetParams) => petApi.deletePet(params),
    onSuccess: (_, variables) => {
      // Invalidate pets list and remove pet detail from cache
      queryClient.invalidateQueries({ queryKey: ['pets', 'by-owner', profile!.idAccount] });
      queryClient.removeQueries({ queryKey: ['pet-detail', variables.idThuCung] });
    }
  });
};
