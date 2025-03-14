import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),
  
  maxMembers: z.number()
    .int('Maximum members must be a whole number')
    .min(2, 'Group must allow at least 2 members')
    .max(100, 'Group cannot exceed 100 members'),
  
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot exceed 50 characters')
    .trim(),
  
  targetAmount: z.number()
    .positive('Target amount must be greater than 0')
    .max(1000000, 'Target amount cannot exceed 1,000,000'),
  
  expiryDate: z.string()
    .datetime('Invalid date format')
    .refine(
      (date) => new Date(date) > new Date(),
      'Expiry date must be in the future'
    ),
  
  image: z.string()
    .url('Invalid image URL')
    .optional(),
  
  rules: z.array(
    z.string()
      .min(1, 'Rule cannot be empty')
      .max(200, 'Rule cannot exceed 200 characters')
      .trim()
  )
    .min(0, 'Rules array must be defined')
    .max(10, 'Cannot have more than 10 rules')
    .optional()
    .default([]),
}); 