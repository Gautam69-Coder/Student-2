import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as icons from 'simple-icons';
import { fetchCodingPractices } from '@/Api/api';
import { DashboardLayout } from "@/components/layout/layout";
import { DashStatCard as DashboardStatCard } from "@/components/widgets/stat-card";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { Home, FileText, FlaskConical, Code2, Users, MessageSquare, Info } from 'lucide-react';
import { theme } from '@/lib/theme';

const CodingPractice = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetchCodingPractices();
                if (!isMounted) return;

                setCards(Array.isArray(res?.data.data) ? res.data.data : []);
            } catch (e) {
                if (!isMounted) return;
                setError(e);
                setCards([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, []);

    function getBrandColor(language = '') {
        const normalized = String(language);
        const key = `si${normalized.charAt(0).toUpperCase()}${normalized.slice(1).toLowerCase()}`;
        const icon = icons[key];
        return icon ? `#${icon.hex}` : '#3B82F6';
    }

    return (
        <DashboardLayout
           
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.dark }}>
                        Welcome to Coding Practice! 👋
                    </h1>
                    <p className="text-sm" style={{ color: theme.colors.darkGray }}>
                        Sharpen your problem-solving by practicing small coding challenges daily—start simple, write clean logic,
                        and improve with every attempt.
                    </p>
                </div>

                {/* Practice Tracks Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.dark }}>Choose a practice track</h2>

                    {loading ? (
                        <div className="text-center py-12" style={{ color: theme.colors.darkGray }}>
                            <div className="inline-block">
                                <div className="animate-spin mb-2">⚙️</div>
                                <p>Loading tracks...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load tracks
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {cards.map((item, index) => {
                                const color = getBrandColor(item.language);

                                return (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        key={item._id || item.language || index}
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/coding-practice/${encodeURIComponent(
                                                    String(item.language || item.title || 'html')
                                                        .replace(/^practice\s*/i, '')
                                                        .toLowerCase()
                                                )}`
                                            )
                                        }
                                        className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                        style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}
                                    >
                                        {/* Gradient Header */}
                                        <div
                                            className="h-24 relative"
                                            style={{
                                                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-black/5" />
                                        </div>

                                        {/* Language Icon */}
                                        <div className="absolute top-12 left-4">
                                            <div
                                                className="w-16 h-16 rounded-xl shadow-md flex items-center justify-center border-4"
                                                style={{ background: theme.colors.white, borderColor: color }}
                                            >
                                                <img
                                                    src={`https://cdn.simpleicons.org/${String(item.language || '').toLowerCase()}`}
                                                    alt={item.language}
                                                    className="w-8 h-8"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-4 pt-12 pb-4">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h2 className="font-bold" style={{ color: theme.colors.dark }}>
                                                    {item.title}
                                                </h2>
                                                <span
                                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                                    style={{ background: `${color}20`, color: color }}
                                                >
                                                    {item.language}
                                                </span>
                                            </div>

                                            <p className="text-xs line-clamp-2 mb-4" style={{ color: theme.colors.darkGray }}>
                                                {item.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div
                                                    className="p-3 rounded-lg"
                                                    style={{ background: theme.colors.softGray }}
                                                >
                                                    <p className="text-xs font-semibold" style={{ color: theme.colors.darkGray }}>Problems</p>
                                                    <p className="text-lg font-bold mt-1" style={{ color: theme.colors.dark }}>
                                                        {item.problemList.map(i => i).length}
                                                    </p>
                                                </div>

                                                <div
                                                    className="p-3 rounded-lg"
                                                    style={{ background: theme.colors.softGray }}
                                                >
                                                    <p className="text-xs font-semibold" style={{ color: theme.colors.darkGray }}>Level</p>
                                                    <p className="text-lg font-bold mt-1" style={{ color: theme.colors.dark }}>
                                                        {item.level}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Button */}
                                            <button
                                                className="w-full py-2 rounded-lg text-sm font-bold transition-all"
                                                style={{
                                                    background: theme.colors.lime,
                                                    color: theme.colors.dark,
                                                }}
                                            >
                                                Start Practice →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export { CodingPractice };
