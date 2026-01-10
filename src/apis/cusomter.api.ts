import type { GetCustomerByPhoneParams } from '~/types/customer.type';
import http from '~/utils/http';

const getCustomerByPhone = (params: GetCustomerByPhoneParams) => {
  return http.get('/customers/search-by-phone', {
    params: params
  });
};

const customerApi = {
  getCustomerByPhone
};

export default customerApi;
