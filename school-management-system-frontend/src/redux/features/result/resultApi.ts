import { baseApi } from "@/redux/api/baseApi";
import { IResult, CreateResultData, UpdateResultData, ResultFilters } from "@/types/result";

const resultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createResult: builder.mutation<IResult, CreateResultData>({
      query: (data) => ({
        url: "/result/create-result",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Result" }],
    }),

    getAllResults: builder.query<{ data: { results: IResult[]; count: number; page: number; limit: number; totalPages: number } }, ResultFilters | undefined>({
      query: (filters) => ({
        url: "/result",
        method: "GET",
        params: filters,
      }),
      providesTags: [{ type: "Result" }],
    }),

    getResultsByDomain: builder.query<{ data: IResult[] }, { domain: string; filters?: ResultFilters }>({
      query: ({ domain, filters }) => ({
        url: `/result/${domain}`,
        method: "GET",
        params: filters,
      }),
      providesTags: [{ type: "Result" }],
    }),

    getSingleResult: builder.query<{ data: IResult }, string>({
      query: (id) => ({
        url: `/result/single/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: "Result" }],
    }),

    updateResult: builder.mutation<IResult, { id: string; data: UpdateResultData }>({
      query: ({ id, data }) => ({
        url: `/result/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Result" }],
    }),

    deleteResultById: builder.mutation<IResult, string>({
      query: (id) => ({
        url: `/result/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Result" }],
    }),

    getResultsByStudent: builder.query<{ data: IResult[] }, string>({
      query: (studentId) => ({
        url: `/result/student/${studentId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Result" }],
    }),

    getMyResults: builder.query<{ data: IResult[] }, void>({
      query: () => ({
        url: "/result/my-results",
        method: "GET",
      }),
      providesTags: [{ type: "Result" }],
    }),

    getResultsByExam: builder.query<{ data: IResult[] }, string>({
      query: (examId) => ({
        url: `/result/exam/${examId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Result" }],
    }),

    getResultStatistics: builder.query<{
      data: {
        totalResults: number;
        averageGPA: number;
        passedCount: number;
        failedCount: number;
      }
    }, void>({
      query: () => ({
        url: "/result/statistics/overview",
        method: "GET",
      }),
      providesTags: [{ type: "Result" }],
    }),
  }),
});

export const {
  useCreateResultMutation,
  useGetAllResultsQuery,
  useGetResultsByDomainQuery,
  useGetSingleResultQuery,
  useUpdateResultMutation,
  useDeleteResultByIdMutation,
  useGetResultsByStudentQuery,
  useGetMyResultsQuery,
  useGetResultsByExamQuery,
  useGetResultStatisticsQuery,
} = resultApi;
