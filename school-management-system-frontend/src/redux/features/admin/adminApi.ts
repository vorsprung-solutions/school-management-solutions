import { baseApi } from "@/redux/api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Banner APIs --------
    createBanner: builder.mutation({
      query: (data) => ({
        url: "/banner/create-banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Banner" }],
    }),
    getAllBannerByDomain: builder.query({
      query: (domain) => ({
        url: `banner/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Banner" }],
    }),
    getSingleBannerById: builder.query({
      query: (id) => ({
        url: `banner/single/${id}`,
        method: "GET",
      }),
    }),
    deleteBannerById: builder.mutation({
      query: (id) => ({
        url: `banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Banner" }],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Banner" }],
    }),

    // -------- Notice APIs --------
    createNotice: builder.mutation({
      query: (data) => ({
        url: "/notice/create-notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Notice" }],
    }),
    getAllNoticeByDomain: builder.query({
      query: (domain) => ({
        url: `notice/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Notice" }],
    }),
    getSingleNoticeById: builder.query({
      query: (id) => ({
        url: `notice/single/${id}`,
        method: "GET",
      }),
    }),
    deleteNoticeById: builder.mutation({
      query: (id) => ({
        url: `notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notice" }],
    }),
    updateNotice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Notice" }],
    }),
  }),
});

export const {
  // Banner hooks
  useCreateBannerMutation,
  useGetAllBannerByDomainQuery,
  useGetSingleBannerByIdQuery,
  useUpdateBannerMutation,
  useDeleteBannerByIdMutation,

  // Notice hooks
  useCreateNoticeMutation,
  useGetAllNoticeByDomainQuery,
  useGetSingleNoticeByIdQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeByIdMutation,
} = adminApi;
