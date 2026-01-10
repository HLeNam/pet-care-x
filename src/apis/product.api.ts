import type { ProductItemResponse, ProductListParams, ProductListResponse } from '~/types/product.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getProductList = async (params: ProductListParams) => {
  return http.get<ProductListResponse>('/products', {
    params: {
      ...params
    }
  });
};

const searchProducts = async (params: ProductListParams) => {
  return http.get<ProductListResponse>('/products/search', {
    params: {
      ...params
    }
  });
};

const getProductDetails = async (productId: string) => {
  return http.get<ResponseApi<ProductItemResponse>>(`/products/${productId}`);
};

const productApi = {
  getProductList,
  searchProducts,
  getProductDetails
};

export default productApi;
