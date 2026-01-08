import { z } from 'zod';

const MedicalRecordSchema = z.object({
  id: z.number(),
  petName: z.string(),
  date: z.string(),
  doctor: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  cost: z.number(),
  symptoms: z.string().optional(),
  prescriptions: z.array(z.string()).optional(),
  nextAppointment: z.string().optional(),
  notes: z.string().optional()
});

export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;
