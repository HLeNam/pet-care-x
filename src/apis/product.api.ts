import type {
  MedicineListResponse,
  ProductItemResponse,
  ProductListParams,
  ProductListResponse
} from '~/types/product.type';
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

const searchMedicines = async (params: ProductListParams) => {
  return http.get<ResponseApi<MedicineListResponse>>('/products/medicines/search', {
    params: {
      ...params
    }
  });
};

const productApi = {
  getProductList,
  searchProducts,
  getProductDetails,
  searchMedicines
};

export default productApi;
