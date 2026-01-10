import type { OrderRequest } from '~/types/order.type';
import http from '~/utils/http';

const createOrder = async (data: OrderRequest) => {
  return http.post('/web/orders', data);
};

const orderApi = {
  createOrder
};

export default orderApi;
