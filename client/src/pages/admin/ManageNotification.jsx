import React, { useState } from 'react';
import { sendNotification } from '@/Api/api';
import { Send, Bell, MessageSquare } from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

export const ManageNotification = () => {
    useTitle("Notifications Management - Admin Dashboard");
    const [formData, setFormData] = useState({
        title: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await sendNotification(formData);
            setStatus({ type: 'success', message: 'Notification sent successfully!' });
            setFormData({ title: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.msg || 'Failed to send notification. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 select-none">
            <div className="neo-flat p-8 overflow-hidden transition-all duration-300 border-none shadow-none">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3.5 rounded-xl shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] text-indigo-500 dark:text-[#CCFF00] bg-transparent flex items-center justify-center">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Broadcast Notification</h2>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mt-1">Send a message to all registered students instantly.</p>
                        </div>
                    </div>

                    {status.message && (
                        <div className={`p-4 mb-6 rounded-xl text-xs font-bold uppercase tracking-wider border-none ${
                            status.type === 'success'
                                ? 'shadow-[inset_2px_2px_4px_rgba(16,185,129,0.1)] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'shadow-[inset_2px_2px_4px_rgba(239,68,68,0.1)] bg-rose-500/10 text-rose-500'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Notification Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Server Maintenance or New Resource Uploaded"
                                    className="w-full px-4 py-3.5 neo-inset focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Notification Content</label>
                            <textarea
                                required
                                rows="5"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe the notification in detail..."
                                className="w-full px-4 py-3.5 neo-inset focus:outline-none text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 neo-btn text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-400 dark:border-slate-600 border-t-indigo-500 dark:border-t-[#CCFF00] rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Notification
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

