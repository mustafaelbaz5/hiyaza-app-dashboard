import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCity, getCities, publishCity, unpublishCity } from '../services/city.service';

const CITIES_QUERY_KEY = ['cities'] as const;

export function useCities() {
  return useQuery({
    queryKey: CITIES_QUERY_KEY,
    queryFn: getCities,
  });
}

export function usePublishCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishCity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEY }),
  });
}

export function useUnpublishCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unpublishCity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEY }),
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CITIES_QUERY_KEY }),
  });
}
