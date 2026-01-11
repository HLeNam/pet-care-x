import {
  type GetPetDetailParams,
  type GetPetDetailResponse,
  type GetPetMedicalRecordsParams,
  type GetPetMedicalRecordsResponse,
  type GetPetsByOwnerIdParams,
  type GetPetsByOwnerIdResponse,
  type CreatePetParams,
  type CreatePetResponse,
  type UpdatePetParams,
  type UpdatePetResponse,
  type DeletePetParams,
  type DeletePetResponse
} from '~/types/pet.type';
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

const getPetDetails = (params: GetPetDetailParams) => {
  return http.get<ResponseApi<GetPetDetailResponse>>(`http://localhost:9090/api/thucung/detail/${params.idThuCung}`);
};

const getPetMedicalRecords = (params: GetPetMedicalRecordsParams) => {
  return http.get<ResponseApi<GetPetMedicalRecordsResponse>>(
    `http://localhost:9090/api/hosokhambenh/all/${params.idThuCung}`,
    {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }
    }
  );
};

const createPet = (params: CreatePetParams) => {
  console.log('🚀 ~ createPet ~ params:', JSON.stringify(params, null, 2));
  return http.post<ResponseApi<unknown>>('http://localhost:9090/api/thucung/create', {
    ...params
  });
};

const updatePet = (params: UpdatePetParams) => {
  return Promise.reject(new Error('API endpoint not yet implemented'));
};

const deletePet = (params: DeletePetParams) => {
  return Promise.reject(new Error('API endpoint not yet implemented'));
};

const petApi = {
  getPetByOwnerId,
  getPetDetails,
  getPetMedicalRecords,
  createPet,
  updatePet,
  deletePet
};

export default petApi;
