import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";
import { ADMIN_USERS_URL } from "@/utils/constants";

export const adminUserApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        countUsers: builder.query({
            query: () => ({
                url: ADMIN_USERS_URL,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
        }),
    }),
});

export const { useCountUsersQuery } = adminUserApiSlice;
