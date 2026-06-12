import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  KPIResponse,
  RevenueData,
  InventoryData,
  ExpiryData,
  AgeGroupData,
  CovidData,
} from '../types/analytics';
import type { ETLJobResponse } from '../types/etl';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['ETL', 'Analytics'],
  endpoints: (builder) => ({
    getKpis: builder.query<KPIResponse, void>({
      query: () => 'analytics/kpis/',
      providesTags: ['Analytics'],
    }),
    getRevenue: builder.query<RevenueData[], { group_by?: string }>({
      query: ({ group_by }) => `analytics/revenue/${group_by ? `?group_by=${group_by}` : ''}`,
      transformResponse: (response: any) => response.data,
      providesTags: ['Analytics'],
    }),
    getInventory: builder.query<InventoryData[], { view?: string; threshold?: number }>({
      query: ({ view, threshold }) => {
        const params = new URLSearchParams();
        if (view) params.append('view', view);
        if (threshold) params.append('threshold', threshold.toString());
        const qs = params.toString();
        return `analytics/inventory/${qs ? `?${qs}` : ''}`;
      },
      transformResponse: (response: any) => response.data,
      providesTags: ['Analytics'],
    }),
    getExpiry: builder.query<ExpiryData[], { days?: number }>({
      query: ({ days }) => `analytics/expiry/${days ? `?days=${days}` : ''}`,
      transformResponse: (response: any) => response.by_medicine,
      providesTags: ['Analytics'],
    }),
    getDemographics: builder.query<AgeGroupData[], void>({
      query: () => 'analytics/age-groups/',
      transformResponse: (response: any) => response.data,
      providesTags: ['Analytics'],
    }),
    getCovid: builder.query<CovidData[], { group_by?: string }>({
      query: ({ group_by }) => `analytics/covid/${group_by ? `?group_by=${group_by}` : ''}`,
      transformResponse: (response: any) => response.data,
      providesTags: ['Analytics'],
    }),
    getEtlJobs: builder.query<ETLJobResponse[], void>({
      query: () => 'etl/',
      transformResponse: (response: any) => response.results || response, // handles pagination
      providesTags: ['ETL'],
    }),
    getEtlJob: builder.query<ETLJobResponse, number>({
      query: (id) => `etl/${id}/`,
      providesTags: ['ETL'],
    }),
    uploadCsv: builder.mutation<ETLJobResponse, FormData>({
      query: (formData) => ({
        url: 'uploads/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ETL', 'Analytics'],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetRevenueQuery,
  useGetInventoryQuery,
  useGetExpiryQuery,
  useGetDemographicsQuery,
  useGetCovidQuery,
  useGetEtlJobsQuery,
  useGetEtlJobQuery,
  useUploadCsvMutation,
} = api;
