import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/context/SocketContext';

/**
 * Hook to automatically synchronize application data across clients in real time.
 * When admin updates coding practices, practicals, notes, or sections,
 * the server broadcasts events over Socket.io, and this hook invalidates
 * the corresponding React Query cache keys so views refresh seamlessly without page reloads.
 */
export function useRealtimeSync() {
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const handleCodingPracticeUpdate = (data) => {
            console.log('⚡ Realtime sync: coding_practice_updated', data);
            queryClient.invalidateQueries({ queryKey: ['codingPractices'] });
            window.dispatchEvent(new CustomEvent('coding-practice-sync', { detail: data }));
        };

        const handlePracticalsUpdate = (data) => {
            console.log('⚡ Realtime sync: practicals_updated', data);
            queryClient.invalidateQueries({ queryKey: ['practicals'] });
            window.dispatchEvent(new CustomEvent('practicals-sync', { detail: data }));
        };

        const handleNotesUpdate = (data) => {
            console.log('⚡ Realtime sync: notes_updated', data);
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            window.dispatchEvent(new CustomEvent('notes-sync', { detail: data }));
        };

        const handleSectionsUpdate = (data) => {
            console.log('⚡ Realtime sync: sections_updated', data);
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            window.dispatchEvent(new CustomEvent('sections-sync', { detail: data }));
        };

        socket.on('coding_practice_updated', handleCodingPracticeUpdate);
        socket.on('practicals_updated', handlePracticalsUpdate);
        socket.on('notes_updated', handleNotesUpdate);
        socket.on('sections_updated', handleSectionsUpdate);

        return () => {
            socket.off('coding_practice_updated', handleCodingPracticeUpdate);
            socket.off('practicals_updated', handlePracticalsUpdate);
            socket.off('notes_updated', handleNotesUpdate);
            socket.off('sections_updated', handleSectionsUpdate);
        };
    }, [socket, queryClient]);

    return { isConnected };
}
