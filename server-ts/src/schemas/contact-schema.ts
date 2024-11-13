import { z } from 'zod';

export const createContactSchema = z.object({
    name: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    surname: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    email: z
        .string()
        .email('must be a valid email')
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
    phone_number: z
        .string()
        .min(3, 'must be at least 3 characters long')
        .max(30, 'must be at most 30 characters long'),
});

export const updateContactSchema = z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().optional(),
    phone_number: z.string().optional(),
});
