import {
  type GetPetDetailParams,
  type GetPetDetailResponse,
  type GetPetMedicalRecordsParams,
  type GetPetMedicalRecordsResponse,
  type GetPetsByOwnerIdParams,
  type GetPetsByOwnerIdResponse
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

const petApi = {
  getPetByOwnerId,
  getPetDetails,
  getPetMedicalRecords
};

export default petApi;
