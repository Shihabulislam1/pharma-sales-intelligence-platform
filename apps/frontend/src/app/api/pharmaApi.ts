import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pharmaApi = createApi({
  reducerPath: 'pharmaApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: [],
  endpoints: (builder) => ({
    getHeartbeat: builder.query<{ status: string }, void>({
      query: () => 'heartbeat/',
    }),
  }),
});

export const { useGetHeartbeatQuery } = pharmaApi;
