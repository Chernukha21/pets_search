import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const petApi = createApi({
  reducerPath: 'petApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
  }),

  tagTypes: ['Pet'],

  endpoints: (builder) => ({
    getPets: builder.query({
      query: (params = {}) => ({
        url: '/pets',
        params,
      }),

      transformResponse: (response) => response.data ?? response,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Pet',
                id,
              })),
              {
                type: 'Pet',
                id: 'LIST',
              },
            ]
          : [
              {
                type: 'Pet',
                id: 'LIST',
              },
            ],
    }),
    getPetTypes: builder.query({
      query: () => '/pet-types',

      transformResponse: (response) => response.data ?? response,
    }),
    createPet: builder.mutation({
      query: (petData) => ({
        url: '/pets',
        method: 'POST',
        body: petData,
      }),
      transformResponse: (response) => ({
        pet: response.data,
        message: response.message,
      }),
      invalidatesTags: [
        {
          type: 'Pet',
          id: 'LIST',
        },
      ],
    }),
    deletePet: builder.mutation({
      query: (id) => ({
        url: `/pets/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data ?? response,
      invalidatesTags: [
        {
          type: 'Pet',
          id: 'LIST',
        },
      ],
    }),
    updatePet: builder.mutation({
      query: ({ id, isFound }) => ({
        url: `/pets/${id}`,
        method: 'PATCH',
        body: {
          isFound,
        },
      }),

      invalidatesTags: [{ type: 'Pet', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPetsQuery,
  useCreatePetMutation,
  useGetPetTypesQuery,
  useDeletePetMutation,
  useUpdatePetMutation,
} = petApi;
