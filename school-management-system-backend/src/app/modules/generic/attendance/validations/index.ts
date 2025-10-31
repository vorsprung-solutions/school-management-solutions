import {
  createAttendanceZodSchema,
  updateAttendanceZodSchema,
  getAttendanceQueryZodSchema,
} from './attendance.validations';

export const AttendanceValidations = {
  create: createAttendanceZodSchema,
  update: updateAttendanceZodSchema,
  getAttendanceQuery: getAttendanceQueryZodSchema,
};
