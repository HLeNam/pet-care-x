import { useQuery } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';

interface UsePetDetailsParams {
  idThuCung: number | null;
  enabled?: boolean;
}

/**
 * Hook để lấy thông tin chi tiết của thú cưng
 */
export const usePetDetails = ({ idThuCung, enabled = true }: UsePetDetailsParams) => {
  return useQuery({
    queryKey: ['pet', 'details', idThuCung],
    queryFn: () => petApi.getPetDetails({ idThuCung: idThuCung! }),
    enabled: enabled && idThuCung !== null,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
    gcTime: 5 * 60 * 1000 // Keep cache 5 minutes
  });
};
