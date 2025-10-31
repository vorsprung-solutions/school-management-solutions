import { baseApi } from "@/redux/api/baseApi";
import {
  IAttendance,
  IAttendanceQuery,
  IAttendanceResponse,
  IAttendanceStatsResponse,
  ICreateAttendanceData,
  IUpdateAttendanceData,
} from "@/types/attendance";
import { IStudent } from "@/types/student";

const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all attendance with pagination and filtering
    getAllAttendance: builder.query<IAttendanceResponse, IAttendanceQuery>({
      query: (params) => ({
        url: "/attendance",
        method: "GET",
        params,
      }),
    }),

    // Get attendance statistics
    getAttendanceStats: builder.query<
      IAttendanceStatsResponse,
      IAttendanceQuery
    >({
      query: (params) => ({
        url: "/attendance/stats",
        method: "GET",
        params,
      }),
    }),

    // Get attendance by ID
    getAttendanceById: builder.query<{ data: IAttendance }, string>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: "GET",
      }),
    }),

    // Get student attendance
    getStudentAttendance: builder.query<
      IAttendanceResponse,
      { studentId: string; query: IAttendanceQuery }
    >({
      query: ({ studentId, query }) => ({
        url: `/attendance/student/${studentId}`,
        method: "GET",
        params: query,
      }),
    }),

    // Get current student's attendance
    getMyAttendance: builder.query<IAttendanceResponse, IAttendanceQuery>({
      query: (query) => ({
        url: "/attendance/my-attendance",
        method: "GET",
        params: query,
      }),
    }),

    // Get organization attendance
    getOrganizationAttendance: builder.query<{ data: IAttendance[] }, string>({
      query: (organizationId) => ({
        url: `/attendance/organization/${organizationId}`,
        method: "GET",
      }),
    }),

    // Get students for attendance creation
    getStudentsForAttendance: builder.query<{ data: IStudent[] }, void>({
      query: () => ({
        url: "/attendance/students",
        method: "GET",
      }),
    }),

    // Create attendance
    createAttendance: builder.mutation<
      { data: IAttendance },
      ICreateAttendanceData
    >({
      query: (data) => ({
        url: "/attendance",
        method: "POST",
        body: data,
      }),
    }),

    // Update attendance
    updateAttendance: builder.mutation<
      { data: IAttendance },
      { id: string; data: IUpdateAttendanceData }
    >({
      query: ({ id, data }) => ({
        url: `/attendance/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete attendance
    deleteAttendance: builder.mutation<{ data: IAttendance }, string>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAttendanceQuery,
  useGetAttendanceStatsQuery,
  useGetAttendanceByIdQuery,
  useGetStudentAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetOrganizationAttendanceQuery,
  useGetStudentsForAttendanceQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
