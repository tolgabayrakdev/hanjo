import { z } from 'zod';

export const createBudgetSchema = z.object({
    name: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    description: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    amount: z.number().min(0, 'must be a positive number'),
});


export const updateBudgetSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().min(0, 'must be a positive number').optional(),
});