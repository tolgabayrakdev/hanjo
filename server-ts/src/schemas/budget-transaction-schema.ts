import { z } from 'zod';

export const incomeTransactionSchema = z.object({
    budget_id: z.number(),
    amount: z.number().min(0, 'must be a positive number'),
    category: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    description: z.string().optional(),
});

export const expenseTransactionSchema = z.object({
    budget_id: z.number(),
    amount: z.number().min(0, 'must be a positive number'),
    category: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    description: z.string().optional(),
});
