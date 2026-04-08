import { baseApi } from "@/redux/api/baseApi";
import { IOrganization } from "@/types/organization";

// Public organization type without subscription info
export interface IPublicOrganization {
  _id: string;
  name: string;
  subdomain: string;
  customdomain?: string;
  logo?: string;
  email: string;
  phone: number;
  ephone?: number;
  est?: string;
  social?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  address: string;
}

const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationByUser: builder.query<{ data: IOrganization }, void>({
      query: () => ({
        url: "/organization/current",
        method: "GET",
      }),
      providesTags: ['Organization'],
    }),
    getOrganizationById: builder.query<{ data: IOrganization }, string>({
      query: (id) => ({
        url: `/organization/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Organization', id }],
    }),
    getOrganizationByDomain: builder.query<{ data: IPublicOrganization }, string>({
      query: (domain) => ({
        url: `/organization/public/${domain}`,
        method: "GET",
      }),
      providesTags: (result, error, domain) => [{ type: 'Organization', id: domain }],
    }),
    updateOrganization: builder.mutation<
      { data: IOrganization },
      { formData: FormData }
    >({
      query: ({ formData }) => ({
        url: "/organization/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useGetOrganizationByUserQuery,
  useGetOrganizationByIdQuery,
  useGetOrganizationByDomainQuery,
  useUpdateOrganizationMutation,
} = organizationApi;
