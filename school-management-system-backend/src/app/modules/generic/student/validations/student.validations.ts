import { z } from 'zod'; 
 

export const studentZodSchema = z.object({
  body: z.object({
    department: z.string().min(1, 'Department is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    phone: z.number().min(1, 'Phone number is required'),
    ephone: z.number().min(1, 'Emergency phone number is required'),
    profilePicture: z.string().optional(),
    roll_no: z.number(),
    reg_no: z.number(),
    class: z.number(),
    group: z.string().optional(),
    session: z.number(),
    gender: z.enum(['Male', 'Female']),
    dob: z.string().min(1, 'Date of birth is required'),  
    blood_group: z.string().min(1, 'Blood group is required'),
  }),
});

export const createStudentZodSchema = studentZodSchema;

export const updateStudentZodSchema = z.object({
  body: z.object({
    department: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z.union([z.string(), z.number()]).optional(),
    ephone: z.union([z.string(), z.number()]).optional(),
    profilePicture: z.string().optional(),
    roll_no: z.union([z.string(), z.number()]).optional(),
    reg_no: z.union([z.string(), z.number()]).optional(),
    class: z.union([z.string(), z.number()]).optional(),
    group: z.string().optional(),
    session: z.union([z.string(), z.number()]).optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    dob: z.string().optional(),
    blood_group: z.string().optional(),
  }),
});

// Types
export type StudentInput = z.infer<typeof studentZodSchema>;
export type CreateStudentInput = z.infer<typeof createStudentZodSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentZodSchema>;
