
import React from 'react';
import { NotesSection } from '@/components/user/notes-section';
import { useTitle } from '@/hooks/useTitle';

export function Notes({ notes, user, loading, onRefresh }) {
    useTitle("Notes");
    return <NotesSection notes={notes} user={user} loading={loading} onRefresh={onRefresh} />;
}
