import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPracticals } from '@/Api/api';

export const usePracticals = (options = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['practicals'],
        queryFn: async () => {
            const res = await fetchPracticals();
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        ...options,
    });

    const invalidatePracticals = () => {
        return queryClient.invalidateQueries({ queryKey: ['practicals'] });
    };

    return {
        ...query,
        practicals: query.data || [],
        invalidatePracticals,
    };
};
