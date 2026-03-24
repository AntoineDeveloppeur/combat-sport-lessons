import { Login } from "@/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, Login>({
      query: (login) => ({
        url: "/login",
        method: "POST",
        body: login,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
