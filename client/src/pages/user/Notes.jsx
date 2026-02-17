
import React from 'react';
import { NotesSection } from '@/components/user/notes-section';
import { useTitle } from '@/hooks/useTitle';

export function Notes({ refreshKey }) {
    useTitle("Notes");
    return <NotesSection refreshKey={refreshKey} />;
}
