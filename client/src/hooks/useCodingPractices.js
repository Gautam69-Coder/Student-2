import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCodingPractices } from '@/Api/api';

export const useCodingPractices = (options = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['codingPractices'],
        queryFn: async () => {
            const res = await fetchCodingPractices();
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        },
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    const invalidateCodingPractices = () => {
        return queryClient.invalidateQueries({ queryKey: ['codingPractices'] });
    };

    return {
        ...query,
        codingPractices: query.data || [],
        invalidateCodingPractices,
    };
};
