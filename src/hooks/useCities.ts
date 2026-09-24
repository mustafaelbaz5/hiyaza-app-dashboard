import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CitySummary } from "../types/city";
import { deleteCity, getCities, publishCity, unpublishCity } from "../services/city.service";

const CITIES_QUERY_KEY = ["cities"] as const;
type CitiesContext = { previousCities: CitySummary[] | undefined };

export function useCities() {
  return useQuery({
    queryKey: CITIES_QUERY_KEY,
    queryFn: getCities,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

async function prepareCitiesMutation(queryClient: ReturnType<typeof useQueryClient>): Promise<CitiesContext> {
  await queryClient.cancelQueries({ queryKey: CITIES_QUERY_KEY });
  return {
    previousCities: queryClient.getQueryData<CitySummary[]>(CITIES_QUERY_KEY),
  };
}

export function usePublishCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishCity,
    onMutate: async (cityId): Promise<CitiesContext> => {
      const context = await prepareCitiesMutation(queryClient);
      queryClient.setQueryData<CitySummary[]>(CITIES_QUERY_KEY, (cities) =>
        cities?.map((city) => (city.id === cityId ? { ...city, is_published: true } : city)),
      );
      return context;
    },
    onError: (_error, _cityId, context) => {
      if (context?.previousCities) {
        queryClient.setQueryData(CITIES_QUERY_KEY, context.previousCities);
      }
    },
  });
}

export function useUnpublishCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unpublishCity,
    onMutate: async (cityId): Promise<CitiesContext> => {
      const context = await prepareCitiesMutation(queryClient);
      queryClient.setQueryData<CitySummary[]>(CITIES_QUERY_KEY, (cities) =>
        cities?.map((city) => (city.id === cityId ? { ...city, is_published: false } : city)),
      );
      return context;
    },
    onError: (_error, _cityId, context) => {
      if (context?.previousCities) {
        queryClient.setQueryData(CITIES_QUERY_KEY, context.previousCities);
      }
    },
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onMutate: async (cityId): Promise<CitiesContext> => {
      const context = await prepareCitiesMutation(queryClient);
      queryClient.setQueryData<CitySummary[]>(CITIES_QUERY_KEY, (cities) =>
        cities?.filter((city) => city.id !== cityId),
      );
      return context;
    },
    onError: (_error, _cityId, context) => {
      if (context?.previousCities) {
        queryClient.setQueryData(CITIES_QUERY_KEY, context.previousCities);
      }
    },
  });
}
