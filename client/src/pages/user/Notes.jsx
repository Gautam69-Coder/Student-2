import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from "@/components/layout/layout";
import { NotesSection } from '@/components/features/notes/notes-section';
import { SEO } from '@/components/common/SEO';
import { UploadModal } from "@/components/features/notes/upload-modal";
import { useData } from "@/context/DataContext";
import { fetchNotesPaginated } from "@/Api/api";
import { DotLoader } from "@/Utils/loaders";

export const Notes = memo(() => {
    const location = useLocation();
    const sentinelRef = useRef(null);

    const {
        user,
        loading,
        refreshNotes,
    } = useData();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    // Infinite scrolling local states
    const [notesList, setNotesList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [updateNoteId, setUpdateNoteId] = useState(null);

    // Fetch notes function
    const fetchNotesPage = useCallback(async (pageNum) => {
        setIsFetchingMore(true);
        try {
            const res = await fetchNotesPaginated(pageNum, 10);
            const { notes: newNotes, pagination } = res.data.data;
            setNotesList(prev => pageNum === 1 ? newNotes : [...prev, ...newNotes]);
            setHasMore(pagination.hasMore);
        } catch (error) {
            console.error("Error fetching paginated notes:", error);
        } finally {
            setIsFetchingMore(false);
        }
    }, []);

    // Initial fetch of page 1 and consecutive fetches when page increases
    useEffect(() => {
        fetchNotesPage(page);
    }, [page, fetchNotesPage]);

    // Setup intersection observer on sentinel element at bottom of notes list
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasMore && !isFetchingMore) {
                setPage(prev => prev + 1);
            }
        }, { threshold: 1.0 });

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [hasMore, isFetchingMore]);

    // Check if shared parameter was passed to open the upload modal
    useEffect(() => {
        if (location.state?.openShare) {
            setUploadModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // When a note is created (e.g. uploaded), refresh global caches and reset to page 1
    const handleNoteCreated = useCallback(() => {
        refreshNotes();
        setPage(1);
        fetchNotesPage(1);
    }, [refreshNotes, fetchNotesPage]);

    return (
        <>
            <SEO
                title=" Notes & Study Material | Student Hub"
                description="Download high-quality  notes and study material for Mumbai University  students. Premium notes and   notes Mumbai for all semesters."
                url="/dashboard/notes"
            />
            <DashboardLayout
            >
                <div className="space-y-4">
                    <NotesSection
                        notes={notesList}
                        user={user}
                        loading={loading?.notes && page === 1}
                        onRefresh={handleNoteCreated}
                        onShare={() => { setUploadModalOpen(true) }}
                        onUpdate={(id) => { setUploadModalOpen(true); setUpdateNoteId(id) }}
                    />

                    {/* Sentinel element and loading feedback for infinite scroll */}
                    <div ref={sentinelRef} className="py-6 flex justify-center">
                        {isFetchingMore && (
                            <DotLoader size="40px" color="#4f46e5" />
                        )}
                        {!hasMore && notesList.length > 0 && (
                            <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">
                                You have caught up with all notes
                            </p>
                        )}
                    </div>
                </div>
            </DashboardLayout>

            <UploadModal
                open={uploadModalOpen}
                onUpdate={updateNoteId}
                onOpenChange={setUploadModalOpen}
                onNoteCreated={handleNoteCreated}
            />

        </>
    );
});

