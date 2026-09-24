import { useQuery } from "@tanstack/react-query";
import { getCity, getCityBasins, getCityStats } from "../services/city.service";
const options = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;
export function useCity(id: string) {
  return useQuery({
    queryKey: ["city", id],
    queryFn: () => getCity(id),
    enabled: !!id,
    ...options,
  });
}
export function useCityBasins(id: string) {
  return useQuery({
    queryKey: ["city", id, "basins"],
    queryFn: () => getCityBasins(id),
    enabled: !!id,
    ...options,
  });
}
export function useCityStats(id: string) {
  return useQuery({
    queryKey: ["city", id, "stats"],
    queryFn: () => getCityStats(id),
    enabled: !!id,
    ...options,
  });
}
