import React, { useState, useEffect } from 'react';
import { fetchAllFeedback, updateFeedbackStatus } from '@/Api/api';
import {
    MessageSquare, CheckCircle, Clock, AlertCircle,
    Filter, Search, User, Calendar, Tag, ChevronDown,
    MoreVertical, ArrowUpRight
} from 'lucide-react';

export const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadFeedback();
    }, []);

    const loadFeedback = async () => {
        try {
            const res = await fetchAllFeedback();
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Failed to load feedback', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateFeedbackStatus(id, newStatus);
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesFilter = filter === 'All' || f.status === filter;
        const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Reviewed': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-4 h-4" />;
            case 'Reviewed': return <ArrowUpRight className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Feedback</h1>
                    <p className="text-slate-500 mt-1">Review and manage feedback submitted by students</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{feedbacks.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search feedback content or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium italic">Loading feedback...</p>
                </div>
            ) : filteredFeedbacks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFeedbacks.map((f) => (
                        <div key={f._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusStyle(f.status)}`}>
                                        {getStatusIcon(f.status)}
                                        {f.status}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(f.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {f.message}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{f.userId?.username || 'Unknown User'}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{f.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{f.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400">Update Status:</span>
                                <div className="flex items-center gap-2">
                                    {['Pending', 'Reviewed', 'Resolved'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusUpdate(f._id, s)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${f.status === s
                                                    ? 'bg-slate-900 text-white shadow-sm'
                                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No feedback found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                        {searchQuery ? `We couldn't find any results for "${searchQuery}".` : "There's no feedback to review at the moment."}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-sm font-bold text-slate-900 hover:underline"
                        >
                            Clear search filter
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
