import type { BranchListResponse } from '~/types/branch.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getBranchList = async (params: { pageNo?: number; pageSize?: number }) => {
  return http.get<ResponseApi<BranchListResponse>>('http://localhost:9090/api/chinhanh/khambenh', {
    params: {
      ...params
    }
  });
};

const branchApi = {
  getBranchList
};

export default branchApi;
