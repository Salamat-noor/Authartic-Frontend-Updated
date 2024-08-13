import { apiSlice } from "./apiSlice";
import { AUTH_URL, USER_URL } from "../utils/constants";
import { getTokenFromLocalStorage } from "@/utils/get-token";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`, // Make sure AUTH_URL is correctly defined in constants
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: 'auth/resend-verification-email',
        method: 'POST',
        body: email,
      }),
    }),
    activateEmail: builder.query({
      query: (token) => ({
        url: `auth/activate?token=${token}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useRegisterMutation,
  useUpdateProfileMutation,
  useResendVerificationEmailMutation,
  useActivateEmailQuery 
} = usersApiSlice;
