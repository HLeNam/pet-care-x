import z from 'zod';

export const PetSchema = z.object({
  pet_id: z.number(),
  pet_code: z.string(),
  name: z.string(),
  species: z.string(),
  breed: z.string(),
  gender: z.enum(['Male', 'Female', 'Other']),
  birth_date: z.string(),
  health_status: z.string(),
  owner_id: z.number()
});

export type Pet = z.infer<typeof PetSchema>;

// Form schemas for better UX
export const PetFormSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Pet name must be at most 50 characters'),
  species: z.string(),
  breed: z.string().min(1, 'Breed is required').max(50, 'Breed must be at most 50 characters'),
  gender: z.enum(['Male', 'Female', 'Other']),
  birth_date: z.string().date(),
  health_status: z.string()
});

export type PetFormInput = z.input<typeof PetFormSchema>;
