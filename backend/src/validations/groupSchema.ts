import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  maxMembers: z.number().int().min(2).max(100),
  category: z.string(),
  targetAmount: z.number().positive(),
  expiryDate: z.string().datetime(),
  image: z.string().url().optional(),
  rules: z.array(z.string()).optional(),
}); 