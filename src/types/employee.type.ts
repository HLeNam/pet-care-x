import z from "zod";

export const Employee = z.object({
  employee_id: z.number(),
  employee_code: z.string(),
  name: z.string(),
  gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
  position: z.number().optional(),
  branch_id: z.number().optional()
});

export type Employee = z.infer<typeof Employee>;