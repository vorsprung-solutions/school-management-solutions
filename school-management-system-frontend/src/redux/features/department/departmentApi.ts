import { baseApi } from "@/redux/api/baseApi";

const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Department APIs --------
    createDepartment: builder.mutation({
      query: (data) => ({
        url: "/department/create-department",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Department" }],
    }),
    getAllDepartmentByDomain: builder.query({
      query: (domain) => ({
        url: `/department/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "Department" }],
    }),
    getSingleDepartmentById: builder.query({
      query: (id) => ({
        url: `/department/single/${id}`,
        method: "GET",
      }),
    }),
    deleteDepartmentyId: builder.mutation({
      query: (id) => ({
        url: `/department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Department" }],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/department/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: [{ type: "Department" }],
    }),
  }),
});

export const {
  // Department hooks
  useCreateDepartmentMutation,
  useGetAllDepartmentByDomainQuery,
  useDeleteDepartmentyIdMutation,
  useGetSingleDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} = departmentApi;
