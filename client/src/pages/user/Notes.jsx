import React, { memo } from 'react';
import { NotesSection } from '@/components/user/notes-section';
import { useTitle } from '@/hooks/useTitle';

export const Notes = memo(({ notes, user, loading, onRefresh }) => {
    useTitle("Notes");
    return <NotesSection notes={notes} user={user} loading={loading} onRefresh={onRefresh} />;
});
