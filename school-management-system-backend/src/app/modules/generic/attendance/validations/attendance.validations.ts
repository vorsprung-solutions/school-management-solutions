import { z } from 'zod';

export const attendanceStatusEnum = z.enum(['present', 'absent', 'late', 'leave']);

export const attendanceZodSchema = z.object({
  body: z.object({
    student: z.string().min(1, 'Student is required'),
    status: attendanceStatusEnum,
    date: z.string().optional(),
    remark: z.string().optional(),
  }),
});

export const updateAttendanceZodSchema = z.object({
  body: z.object({
    status: attendanceStatusEnum.optional(),
    date: z.string().optional(),
    remark: z.string().optional(),
  }),
});

export const attendanceQueryZodSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: attendanceStatusEnum.optional(),
    class: z.union([
      z.string().refine(val => val === 'all' || !isNaN(parseInt(val, 10)), {
        message: 'Class must be a valid number or "all"'
      }).transform(val => val === 'all' ? undefined : parseInt(val, 10)),
      z.number()
    ]).optional(),
    session: z.union([
      z.string().refine(val => val === 'all' || !isNaN(parseInt(val, 10)), {
        message: 'Session must be a valid number or "all"'
      }).transform(val => val === 'all' ? undefined : parseInt(val, 10)),
      z.number()
    ]).optional(),
    group: z.string().optional(),
    department: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    month: z.string().transform(val => parseInt(val, 10)).optional(),
    year: z.string().transform(val => parseInt(val, 10)).optional(),
    page: z.string().transform(val => parseInt(val, 10)).optional(),
    limit: z.string().transform(val => parseInt(val, 10)).optional(),
  }),
});

export const createAttendanceZodSchema = attendanceZodSchema;
export const getAttendanceQueryZodSchema = attendanceQueryZodSchema;

// Types
export type AttendanceInput = z.infer<typeof attendanceZodSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceZodSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQueryZodSchema>;
