import { useQuery } from '@tanstack/react-query';
import customerApi from '~/apis/cusomter.api';

interface UseCustomerByPhoneParams {
  phoneNumber: string;
  enabled?: boolean;
}

export const useCustomerByPhone = ({ phoneNumber, enabled = false }: UseCustomerByPhoneParams) => {
  return useQuery({
    queryKey: ['customer', 'by-phone', phoneNumber],
    queryFn: () => customerApi.getCustomerByPhone({ soDienThoai: phoneNumber }),
    enabled: enabled && phoneNumber.length > 0,
    retry: false,
    staleTime: 0 // Luôn fetch fresh data khi search
  });
};
