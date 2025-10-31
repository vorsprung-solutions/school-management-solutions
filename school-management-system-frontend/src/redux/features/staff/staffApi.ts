import { baseApi } from "@/redux/api/baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Staff APIs --------
    createStaff: builder.mutation({
      query: (data) => ({
        url: "/user/create-staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Staff" }],
    }),

    getAllStaffByDomain: builder.query({
      query: (domain) => ({
        url: `/staff/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Staff" }],
    }),

    getSingleStaffById: builder.query({
      query: (id) => ({
        url: `/staff/single/${id}`,
        method: "GET",
      }),
    }),

    deleteStaffById: builder.mutation({
      query: (id) => ({
        url: `/staff/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Staff" }],
    }),

    blockStaffById: builder.mutation({
      query: (id) => ({
        url: `/staff/block/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Staff" }],
    }),

    updateStaff: builder.mutation({
      query: ({ ...patch }) => ({
        url: `/staff`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: [{ type: "Staff" }],
    }),

    updateStaffByAdmin: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/staff/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Staff" }],
    }),
  }),
});

export const {
  // Staff hooks
  useCreateStaffMutation,
  useGetAllStaffByDomainQuery,
  useGetSingleStaffByIdQuery,
  useDeleteStaffByIdMutation,
  useBlockStaffByIdMutation,
  useUpdateStaffMutation,
  useUpdateStaffByAdminMutation,
} = staffApi;
