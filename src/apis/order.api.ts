import type { GetOrdersParams, GetOrdersResponse, OrderRequest } from '~/types/order.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const createOrder = async (data: OrderRequest) => {
  return http.post('/web/orders', data);
};

const getOrders = async (params: GetOrdersParams) => {
  return http.get<ResponseApi<GetOrdersResponse>>('/web/orders', { params });
};

const orderApi = {
  createOrder,
  getOrders
};

export default orderApi;
