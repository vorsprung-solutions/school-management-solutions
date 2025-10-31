/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl:  process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 404 && args.url?.includes("user")) {
    // only show toast if the request is related to user
    toast.error("User not found");
  }

  if (result?.error?.status === 401) {
    const refreshUrl =
      (process.env.NEXT_PUBLIC_BASE_API
        ? `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`
        : "http://localhost:5000/api/auth/refresh-token");
    const res = await fetch(refreshUrl, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data?.data?.accessToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "Banner",
    "Student",
    "Notice",
    "Department",
    "Teacher",
    "Staff",
    "About",
    "publicstudents",
    "Exam",
    "Result",
    "Organization",
  ],
  endpoints: () => ({}),
});
