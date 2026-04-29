import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Clock, MapPin, Activity } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { fetchGuestVisits } from "@/Api/api";

export function ManageGuestVisits() {
    useTitle("Guest User Saved Data");
    const [guestVisits, setGuestVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGuestVisits()
            .then(res => {
                setGuestVisits(res.data.guestVisits || []);
            })
            .catch(err => {
                console.error("Failed to load guest visits:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalGuests = guestVisits.length;
    const countries = [...new Set(guestVisits.map(visit => visit.country || 'Unknown'))];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-5 h-5 text-slate-900 dark:text-white" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Guest Visit Tracker</h2>
                    </div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{totalGuests}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Guest visit records stored in the database.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-slate-900 dark:text-white" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Countries</h2>
                    </div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{countries.length}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Unique countries detected from guest visitors.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Device</h2>
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{guestVisits[0]?.device || 'No data yet'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Most recent guest device details.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Guest User Saved Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All guest visit events with saved date, time, device and country data.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Date</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Time</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Section</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Device</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Country</th>
                                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Recorded At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-500">Loading guest visits...</td></tr>
                            ) : guestVisits.length === 0 ? (
                                <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-500">No guest visits recorded yet.</td></tr>
                            ) : guestVisits.map((visit) => (
                                <tr key={visit._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{visit.visitDate}</td>
                                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{visit.visitTime}</td>
                                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{visit.section}</td>
                                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200 break-words max-w-[220px]">{visit.device}</td>
                                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{visit.country}</td>
                                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{new Date(visit.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
