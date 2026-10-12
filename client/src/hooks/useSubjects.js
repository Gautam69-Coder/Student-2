import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSections } from '@/Api/api';

export const useSubjects = (options = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const res = await fetchSections();
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        },
        staleTime: 10 * 60 * 1000, // 10 minutes cache
        ...options,
    });

    const invalidateSubjects = () => {
        return queryClient.invalidateQueries({ queryKey: ['subjects'] });
    };

    return {
        ...query,
        subjects: query.data || [],
        invalidateSubjects,
    };
};
