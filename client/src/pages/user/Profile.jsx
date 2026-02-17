
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, Camera, Edit2, LogOut, MessageSquare, Info } from "lucide-react";
import { getMe } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";

export function Profile({ onLogout }) {
    useTitle("Profile");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe().then(res => {
            setUser(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-12 text-slate-500">Failed to load profile details.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5] dark:border-slate-800"
            >
                {/* Header/Cover */}
                <div className="h-32 bg-slate-900 dark:bg-slate-950 relative">
                    <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                            <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Student at University</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors">
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard icon={<Mail />} label="Email Address" value={user.email} />
                        <InfoCard icon={<Shield />} label="Account Role" value={user.role?.toUpperCase()} />
                        <InfoCard icon={<Calendar />} label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"} />
                        <InfoCard icon={<MapPin />} label="Location" value="India" />
                    </div>

                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-serif">Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard label="Total Practicals" value="24" />
                            <StatCard label="Notes Shared" value="12" />
                            <StatCard label="Visit Count" value={user.visitCount || 0} />
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <Link
                            to="/dashboard/feedback"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Send Feedback / Message
                        </Link>

                        <Link
                            to="/dashboard/about-contact"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                            <Info className="w-5 h-5" />
                            About & Contact Us
                        </Link>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-400">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-0.5">{value || "N/A"}</p>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        </div>
    );
}
