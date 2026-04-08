import { baseApi } from "@/redux/api/baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- About APIs --------
    createAbout: builder.mutation({
      query: (data) => ({
        url: "/about/create-about",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "About" }],
    }),

    getAboutByDomain: builder.query({
      query: (domain) => ({
        url: `/about/${domain}`,
        method: "GET",
      }),
      providesTags: [{ type: "About" }],
    }),

    getAboutByOrganization: builder.query({
      query: () => ({
        url: `/about/organization/current`,
        method: "GET",
      }),
      providesTags: [{ type: "About" }],
    }),

    updateAbout: builder.mutation({
      query: (data) => ({
        url: "/about/update-about",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "About" }],
    }),

    deleteAbout: builder.mutation({
      query: (id) => ({
        url: `/about/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "About" }],
    }),
  }),
});

export const {
  // About hooks
  useCreateAboutMutation,
  useGetAboutByDomainQuery,
  useGetAboutByOrganizationQuery,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} = aboutApi;
