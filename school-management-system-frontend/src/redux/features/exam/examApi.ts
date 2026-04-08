import { baseApi } from "@/redux/api/baseApi";

const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExam: builder.mutation({
      query: (data) => ({
        url: "/exam/create-exam",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Exam" }],
    }),
    getAllExams: builder.query({
      query: () => ({
        url: "/exam",
        method: "GET",
      }),
      providesTags: [{ type: "Exam" }],
    }),
    getAllExamsByDomain: builder.query({
      query: (domain) => ({
        url: `/exam/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Exam" }],
    }),
    getSingleExam: builder.query({
      query: (id) => ({
        url: `/exam/single/${id}`,
        method: "GET",
      }),
    }),
    deleteExamById: builder.mutation({
      query: (id) => ({
        url: `/exam/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Exam" }],
    }),
    restoreExamById: builder.mutation({
      query: (id) => ({
        url: `/exam/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Exam" }],
    }),
    updateExam: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/exam/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: [{ type: "Exam" }],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetAllExamsQuery,
  useGetAllExamsByDomainQuery,
  useDeleteExamByIdMutation,
  useRestoreExamByIdMutation,
  useGetSingleExamQuery,
  useUpdateExamMutation,
} = examApi;
