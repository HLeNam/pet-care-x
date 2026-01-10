import { type GetPetsByOwnerIdParams, type GetPetsByOwnerIdResponse } from '~/types/pet.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getPetByOwnerId = (params: GetPetsByOwnerIdParams) => {
  return http.get<ResponseApi<GetPetsByOwnerIdResponse>>(`http://localhost:9090/api/thucung/${params.idKhachHang}`, {
    params: {
      pageNo: params.pageNo,
      pageSize: params.pageSize
    }
  });
};

const petApi = {
  getPetByOwnerId
};

export default petApi;
