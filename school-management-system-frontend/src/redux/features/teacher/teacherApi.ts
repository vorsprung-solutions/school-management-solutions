import { baseApi } from "@/redux/api/baseApi";

const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Department APIs --------
    createTeacher: builder.mutation({
      query: (data) => ({
        url: "/user/create-teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Teacher" }],
    }),
    getAllTeacherByDomain: builder.query({
      query: (domain) => ({
        url: `/teacher/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Teacher" }],
    }),
    getSingleTeachertById: builder.query({
      query: (id) => ({
        url: `/teacher/single/${id}`,
        method: "GET",
      }),
    }),
    getCurrentTeacher: builder.query({
      query: () => ({
        url: '/teacher/current',
        method: 'GET',
      }),
      providesTags: ['Teacher'],
    }),
    deleteTeacheryId: builder.mutation({
      query: (id) => ({
        url: `/teacher/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Teacher" }],
    }),
    blockTeacheryId: builder.mutation({
      query: (id) => ({
        url: `/teacher/block/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Teacher" }],
    }),
    updateTeacher: builder.mutation({
      query: (formData) => ({
        url: `/teacher`,
        method: "PUT",
        body: formData,
        // Don't set Content-Type header for FormData
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: [{ type: "Teacher" }],
    }),
    updateTeacherByAdmin: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/teacher/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Teacher" }],
    }),
  }),
});

export const {
  // Teacher hooks
  useCreateTeacherMutation,
  useDeleteTeacheryIdMutation,
  useGetAllTeacherByDomainQuery,
  useGetSingleTeachertByIdQuery,
  useGetCurrentTeacherQuery,
  useUpdateTeacherMutation,
  useUpdateTeacherByAdminMutation,
  useBlockTeacheryIdMutation,
} = teacherApi;
