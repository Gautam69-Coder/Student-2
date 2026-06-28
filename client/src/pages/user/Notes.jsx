import React, { memo, useState } from 'react';
import { DashboardLayout } from "@/components/layout/layout";
import { DashStatCard as DashboardStatCard } from "@/components/widgets/stat-card";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { NotesSection } from '@/components/features/notes/notes-section';
import { SEO } from '@/components/common/SEO';
import { FileText, Users, MessageSquare, FlaskConical, Code2, Info, Home } from 'lucide-react';

import { theme } from '@/lib/theme';

export const Notes = memo(({ notes, user, loading, onRefresh, requireAuth }) => {
  
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

                    <NotesSection notes={notes} user={user} loading={loading} onRefresh={onRefresh} requireAuth={requireAuth} />
                </div>
            </DashboardLayout>
        </>
    );
});

