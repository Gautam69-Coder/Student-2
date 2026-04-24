import React, { memo } from 'react';
import { NotesSection } from '@/components/user/notes-section';
import { SEO } from '@/components/common/SEO';

export const Notes = memo(({ notes, user, loading, onRefresh }) => {
    return (
        <>
            <SEO 
                title="IT Notes & Study Material | Student Hub"
                description="Download high-quality IT notes and study material for Mumbai University IT students. Premium VESIT notes and BSc IT notes Mumbai for all semesters."
                url="/dashboard/notes"
            />
            <NotesSection notes={notes} user={user} loading={loading} onRefresh={onRefresh} />
        </>
    );
});
