import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

export function useQueryHelper({ key, url, method = 'get', enabled = true }) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await apiClient[method](url);
      return data;
    },
    enabled,
  });
}
