import { z } from 'zod';

export const AppointmentSchema = z.object({
  appointment_id: z.number(),
  doctor_id: z.number(),
  pet_id: z.number(),
  customer_id: z.number(),
  branch_id: z.number(),
  appointment_time: z.string(),
  status: z.string(),
  pet_name: z.string().optional(),
  doctor_name: z.string().optional(),
  branch_name: z.string().optional()
});

export const BookingFormSchema = z.object({
  branch_id: z.number().min(1, 'Please select a branch'),
  pet_id: z.number().min(1, 'Please select a pet'),
  doctor_id: z.number().min(1, 'Please select a doctor'),
  booking_date: z.string().nonempty('Please select a date'),
  booking_time: z.string().nonempty('Please select a time')
});

export type Appointment = z.infer<typeof AppointmentSchema>;
export type BookingForm = z.infer<typeof BookingFormSchema>;
