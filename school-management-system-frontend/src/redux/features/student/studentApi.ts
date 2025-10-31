import { baseApi } from "@/redux/api/baseApi";
import { IPublicStudentQuery, IPublicStudentsResponse, IStudent } from "@/types/student";
import { INotice } from "@/types/notice";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Student APIs --------
    createStudent: builder.mutation({
      query: (data) => ({
        url: "/user/create-student",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    getAllStudentByDomain: builder.query({
      query: (domain) => ({
        url: `/student/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Student" }],
    }),
    getSingleStudentById: builder.query({
      query: (id) => ({
        url: `/student/single/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: "Student" }],
    }),
    deleteStudentById: builder.mutation({
      query: (id) => ({
        url: `/student/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    blockStudentById: builder.mutation({
      query: (id) => ({
        url: `/student/block/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    updateStudent: builder.mutation({
      query: (formData) => ({
        url: `/student`,
        method: "PUT",
        body: formData,
        // Don't set Content-Type header for FormData
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    updateStudentByAdmin: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/student/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    getPublicStudents: builder.query<IPublicStudentsResponse, IPublicStudentQuery>({
      query: (params: IPublicStudentQuery) => ({
        url: '/student/public/list',
        method: 'GET',
        params,
      }),
      providesTags: ['Student'],
    }),
    getAllStudents: builder.query({
      query: () => ({
        url: '/student/organization/all',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    getStudentsByFilters: builder.query({
      query: ({ class: classNumber, session, group }) => ({
        url: '/student/filter',
        method: 'GET',
        params: { class: classNumber, session, group },
      }),
      providesTags: ['Student'],
    }),
    getCurrentStudent: builder.query({
      query: () => ({
        url: '/student/current',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),

    // Get dashboard statistics
    getDashboardStats: builder.query<{
      data: {
        counts: {
          totalStudents: number;
          activeStudents: number;
          totalTeachers: number;
          totalStaff: number;
          totalDepartments: number;
          totalExams: number;
          totalResults: number;
          totalNotices: number;
          totalAttendance: number;
        };
        recentActivities: {
          recentStudents: IStudent[];
          recentNotices: INotice[];
        };
      };
    }, void>({
      query: () => ({
        url: '/student/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
  }),
});

export const {
  // Student hooks
  useCreateStudentMutation,
  useDeleteStudentByIdMutation,
  useGetAllStudentByDomainQuery,
  useGetSingleStudentByIdQuery,
  useUpdateStudentMutation,
  useUpdateStudentByAdminMutation,
  useBlockStudentByIdMutation,
  useGetPublicStudentsQuery,
  useGetAllStudentsQuery,
  useGetStudentsByFiltersQuery,
  useGetCurrentStudentQuery,
  useGetDashboardStatsQuery
} = studentApi;
