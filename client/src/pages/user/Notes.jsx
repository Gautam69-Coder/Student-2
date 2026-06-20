import React, { memo, useState } from 'react';
import { DashboardLayout } from "@/components/layout/layout";
import { DashStatCard as DashboardStatCard } from "@/components/widgets/stat-card";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { NotesSection } from '@/components/features/notes/notes-section';
import { SEO } from '@/components/common/SEO';
import { FileText, Users, MessageSquare, FlaskConical, Code2, Info, Home } from 'lucide-react';

import { theme } from '@/lib/theme';

export const Notes = memo(({ notes, user, loading, onRefresh, requireAuth }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isBell, setIsBell] = useState(false);


    const navItems = [
        { label: "Home", icon: Home, path: "/dashboard" },

        { label: "Notes", icon: FileText, path: "/dashboard/notes", active: true },
        { label: "Practicals", icon: FlaskConical, path: "/dashboard/practicals" },
        { label: "Practice", icon: Code2, path: "/dashboard/coding-practice" },
        { label: "Community", icon: Users, path: "/dashboard/community" },
        { label: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },
        { label: "About", icon: Info, path: "/dashboard/about" },

    ];

    return (
        <>
            <SEO
                title="IT Notes & Study Material | Student Hub"
                description="Download high-quality IT notes and study material for Mumbai University IT students. Premium notes and   notes Mumbai for all semesters."
                url="/dashboard/notes"
            />
            <DashboardLayout
            // sidebar={
            //     <DashboardSidebar
            //         navItems={navItems}
            //         userName="Student Name"
            //         userEmail="student@email.com"
            //         searchQuery={searchQuery}
            //         setSearchQuery={setSearchQuery}
            //         isBell={isBell}
            //         setisBell={setIsBell}
            //     />
            // }
            // topNavProps={{
            //     userName: "Lucas Bennett",
            //     userEmail: "bennett02@gmail.com",
            //     userAvatar: "https://i.pravatar.cc/150?img=33",
            //     searchQuery: searchQuery,
            //     setSearchQuery: setSearchQuery,
            //     isBell: isBell,
            //     setisBell: setIsBell,
            // }}
            >
                <div className="space-y-4">

                    <NotesSection notes={notes} user={user} loading={loading} onRefresh={onRefresh} requireAuth={requireAuth} />
                </div>
            </DashboardLayout>
        </>
    );
});

