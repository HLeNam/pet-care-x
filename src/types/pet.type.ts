import z from "zod";

export const PetSchema = z.object({
  pet_id: z.number(),
  pet_code: z.string(),
  name: z.string(),
  species: z.string(),
  breed: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  birth_date: z.string().optional(),
  health_status: z.string().optional(),
  owner_id: z.number()
});

export type Pet = z.infer<typeof PetSchema>;