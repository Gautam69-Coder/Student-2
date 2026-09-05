import React, { memo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from "@/components/layout/layout";
import { NotesSection } from '@/components/features/notes/notes-section';
import { SEO } from '@/components/common/SEO';
import { UploadModal } from "@/components/features/notes/upload-modal";
import { useData } from "@/context/DataContext";

export const Notes = memo(() => {
    const location = useLocation();

    const {
        user,
        loading,
        refreshNotes,
        notes,
    } = useData();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [updateNoteId, setUpdateNoteId] = useState(null);

    // Check if shared parameter was passed to open the upload modal
    useEffect(() => {
        if (location.state?.openShare) {
            setUploadModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // When a note is created (e.g. uploaded), refresh global cached notes
    const handleNoteCreated = useCallback(() => {
        refreshNotes();
    }, [refreshNotes]);

    return (
        <>
            <SEO
                title=" Notes & Study Material | Student Hub"
                description="Download high-quality  notes and study material for Mumbai University  students. Premium notes and   notes Mumbai for all semesters."
                url="/dashboard/notes"
            />
            <DashboardLayout>
                <div className="space-y-4">
                    <NotesSection
                        notes={notes}
                        user={user}
                        loading={loading?.notes}
                        onRefresh={handleNoteCreated}
                        onShare={() => { setUploadModalOpen(true) }}
                        onUpdate={(id) => { setUploadModalOpen(true); setUpdateNoteId(id) }}
                    />
                </div>
            </DashboardLayout>

            <UploadModal
                open={uploadModalOpen}
                onUpdate={updateNoteId}
                onOpenChange={(isOpen) => {
                    setUploadModalOpen(isOpen);
                    if (!isOpen) {
                        setUpdateNoteId(null);
                    }
                }}
                onNoteCreated={handleNoteCreated}
            />

        </>
    );
});

