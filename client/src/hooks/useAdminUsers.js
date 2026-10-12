import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '@/Api/api';

export const useAdminUsers = (options = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const res = await fetchUsers();
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes cache
        ...options,
    });

    const invalidateAdminUsers = () => {
        return queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    };

    return {
        ...query,
        users: query.data || [],
        invalidateAdminUsers,
    };
};
