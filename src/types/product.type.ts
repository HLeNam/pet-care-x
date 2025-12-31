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
  sortBy: z.enum(['price', 'name', 'createdAt', 'sold']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
