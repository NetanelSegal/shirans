import { z } from 'zod';

export const footerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 digits'),
  email: z
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(50, 'Email must be less than 50 characters'),
  context: z.string().optional(),
});

export type FooterFormInput = z.infer<typeof footerFormSchema>;
