import React, { useState } from "react";
import { sendNotification } from "@/Api/api";
import { Send, Bell } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

export const ManageNotification = () => {
    useTitle("Notifications Management - Admin Dashboard");
    const [formData, setFormData] = useState({
        title: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            await sendNotification(formData);
            setStatus({ type: "success", message: "Notification sent successfully!" });
            setFormData({ title: "", message: "" });
        } catch (err) {
            setStatus({
                type: "error",
                message: err.response?.data?.msg || "Failed to send notification. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-primary flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                            Broadcast Notification
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Send an instant platform alert to all registered students.
                        </p>
                    </div>
                </div>

                {status.message && (
                    <div
                        role="status"
                        className={`p-3.5 rounded-xl text-xs font-bold border ${
                            status.type === "success"
                                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                                : "bg-destructive/10 text-destructive border-destructive/25"
                        }`}
                    >
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="notif-title" className="text-xs font-bold text-foreground">
                            Notification Title
                        </label>
                        <input
                            id="notif-title"
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. New DSA Track or Maintenance Notice"
                            className="w-full px-4 min-h-[44px] rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="notif-body" className="text-xs font-bold text-foreground">
                            Notification Content
                        </label>
                        <textarea
                            id="notif-body"
                            required
                            rows="5"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe the update or announcement in detail..."
                            className="w-full p-4 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground resize-none placeholder:text-muted-foreground"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full min-h-[46px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" aria-hidden="true" />
                                Send Notification
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
