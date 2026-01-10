import { z } from 'zod';

export const ProductCategorySchema = z.enum(['food', 'medicine', 'accessory']);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  category: ProductCategorySchema,
  price: z.number(),
  stock: z.number(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  rating: z.number().optional(),
  sold: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: ProductCategorySchema.optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt', 'sold', 'idSanPham']).optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  pageNo: z.number().min(0).optional(),
  pageSize: z.number().min(0).max(100).optional(),
  keyword: z.string().optional()
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;

export type ProductListParams = {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  category?: string;
};

export type ProductStock = {
  idChiNhanh: number;
  tenChiNhanh: string;
  soLuong: number;
  soLuongDaBan: number;
};

export type ProductItemResponse = {
  idSanPham: number;
  maSanPham: string;
  tenSanPham: string;
  loaiSanPham: string;
  giaBan: string;
  hanSuDung: string;
  hinhAnh: string;
  tonKho: ProductStock[];
};

export type ProductListResponse = {
  status: string;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElements: number;
    items: ProductItemResponse[];
  };
};
