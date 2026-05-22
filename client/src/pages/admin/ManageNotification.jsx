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
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-[10px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-900 dark:bg-slate-800 rounded-[10px]">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Broadcast Notification</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Send a message to all registered students instantly.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Notification Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Server Maintenance or New Resource Uploaded"
                                    className="w-full px-4 py-3 rounded-[10px] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-slate-500 transition-all bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Notification Content</label>
                            <textarea
                                required
                                rows="5"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe the notification in detail..."
                                className="w-full px-4 py-3 rounded-[10px] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:border-slate-900 dark:focus:border-slate-500 transition-all bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-[10px] flex items-center justify-center gap-2 text-white font-bold transition-all active:scale-[0.98] ${loading ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-[10px] animate-spin"></div>
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

