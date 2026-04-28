import type { Login, SignUp } from "@/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/users`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; userId: string }, Login>({
      query: (login) => ({
        url: "/login",
        method: "POST",

        body: login,
      }),
    }),
    signUp: builder.mutation<{ token: string; userId: string }, SignUp>({
      query: (signUp) => ({
        url: "/sign-up",
        method: "POST",
        body: signUp,
      }),
    }),
  }),
})

export const { useLoginMutation, useSignUpMutation } = userApi
