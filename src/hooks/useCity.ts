import { useQuery } from '@tanstack/react-query';
import { getCity, getCityBasins, getCityStats } from '../services/city.service';

export function useCity(id: string) {
  return useQuery({
    queryKey: ['city', id],
    queryFn: () => getCity(id),
    enabled: !!id,
  });
}

export function useCityBasins(id: string) {
  return useQuery({
    queryKey: ['city', id, 'basins'],
    queryFn: () => getCityBasins(id),
    enabled: !!id,
  });
}

export function useCityStats(id: string) {
  return useQuery({
    queryKey: ['city', id, 'stats'],
    queryFn: () => getCityStats(id),
    enabled: !!id,
  });
}
