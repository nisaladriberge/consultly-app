import { z } from 'zod';

// 🛡️ Define a strict schema blueprint for registration input
export const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address format" }),
  role: z
    .enum(['client', 'expert'], { message: "Role must be either 'client' or 'expert'" })
});