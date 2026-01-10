import z from 'zod';

export const BranchSchema = z.object({
  branch_id: z.number(),
  branch_code: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  open_time: z.string(),
  close_time: z.string()
});

export type Branch = z.infer<typeof BranchSchema>;

export type BranchItemResponse = {
  idChiNhanh: number;
  tenChiNhanh: string;
};

export type BranchListResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: BranchItemResponse[];
};
