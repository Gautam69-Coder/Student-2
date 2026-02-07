import React from 'react';

export function Skeleton({ className }) {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
    );
}

export function PracticalCardSkeleton() {
    return (
        <div className="glass-card rounded-xl overflow-hidden mb-6 p-5 space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-2 flex-1">
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="w-9 h-9 rounded-lg" />
                </div>
            </div>

            {/* Code Block Skeleton */}
            <div className="rounded-lg border border-slate-100 dark:border-white/5 overflow-hidden">
                <div className="h-10 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5 flex items-center px-4 gap-2">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                </div>
                <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </div>
        </div>
    );
}
