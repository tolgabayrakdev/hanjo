import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    description: z.string(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    dueDate: z.string(),
});

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().optional(),
});
