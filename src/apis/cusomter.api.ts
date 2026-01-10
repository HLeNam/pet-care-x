import type { GetCustomerByPhoneParams, GetCustomerByPhoneResponse } from '~/types/customer.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getCustomerByPhone = (params: GetCustomerByPhoneParams) => {
  return http.get<ResponseApi<GetCustomerByPhoneResponse>>('/customers/search-by-phone', {
    params: params
  });
};

const customerApi = {
  getCustomerByPhone
};

export default customerApi;
