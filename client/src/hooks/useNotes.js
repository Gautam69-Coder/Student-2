import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote, createNoteText, createNoteFile } from '@/Api/api';

export const useNotes = (options = {}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await fetchNotes();
            return Array.isArray(res?.data?.data) ? res.data.data : [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        ...options,
    });

    const invalidateNotes = () => {
        return queryClient.invalidateQueries({ queryKey: ['notes'] });
    };

    return {
        ...query,
        notes: query.data || [],
        invalidateNotes,
    };
};
