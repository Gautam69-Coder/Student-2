import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Users, Search, Check, AlertCircle, Loader2 } from "lucide-react";
import { sendEmail } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";

export function MessageSender({ users }) {
    useTitle("Message Sender");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAllUsers, setIsAllUsers] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggleUser = (email) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter((u) => u !== email));
        } else {
            setSelectedUsers([...selectedUsers, email]);
        }
        setIsAllUsers(false);
    };

    const handleToggleAll = () => {
        setIsAllUsers(!isAllUsers);
        setSelectedUsers([]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!isAllUsers && selectedUsers.length === 0) {
            setStatus({ type: "error", message: "Please select at least one recipient" });
            return;
        }
        if (!subject || !body) {
            setStatus({ type: "error", message: "Subject and message body are required" });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            await sendEmail({
                to: isAllUsers ? undefined : selectedUsers,
                subject,
                body: body.replace(/\n/g, "<br/>"),
                isAllUsers,
            });

            setStatus({ type: "success", message: "Email sent successfully!" });
            if (!isAllUsers) setSelectedUsers([]);
            setSubject("");
            setBody("");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to send email";
            setStatus({ type: "error", message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = (users || []).filter(
        (user) =>
            (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-primary flex items-center justify-center">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Message Sender</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Send email announcements directly to selected students or everyone.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recipients */}
                <div className="lg:col-span-1">
                    <div className="surface-card rounded-2xl overflow-hidden flex flex-col h-[580px]">
                        <div className="p-4 border-b border-border bg-secondary/40 space-y-3">
                            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" aria-hidden="true" /> Recipients
                            </h3>
                            <button
                                type="button"
                                onClick={handleToggleAll}
                                className={`w-full min-h-[40px] px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                                    isAllUsers
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:bg-secondary"
                                }`}
                            >
                                {isAllUsers && <Check className="w-4 h-4" aria-hidden="true" />}
                                Send to All Students
                            </button>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                                    aria-hidden="true"
                                />
                                <input
                                    type="text"
                                    aria-label="Search recipients"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 min-h-[38px] rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-xs text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground text-xs font-semibold">
                                    No users found
                                </div>
                            ) : (
                                filteredUsers.map((user) => {
                                    const selected = selectedUsers.includes(user.email);
                                    return (
                                        <button
                                            key={user._id}
                                            type="button"
                                            onClick={() => handleToggleUser(user.email)}
                                            disabled={isAllUsers}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors border ${
                                                selected
                                                    ? "bg-indigo-500/10 border-primary/40"
                                                    : "bg-background border-border hover:bg-secondary/50"
                                            } ${isAllUsers ? "opacity-40 cursor-not-allowed" : ""}`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                                        selected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-secondary text-muted-foreground"
                                                    }`}
                                                >
                                                    {(user.username || "U").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-foreground truncate">
                                                        {user.username || "Unknown"}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                        {user.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                            {selected && <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-3.5 border-t border-border bg-secondary/30 text-[11px] font-bold text-muted-foreground tabular-nums">
                            {isAllUsers ? "All students selected" : `${selectedUsers.length} user(s) selected`}
                        </div>
                    </div>
                </div>

                {/* Compose */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="surface-card rounded-2xl p-6 space-y-5">
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                role="status"
                                className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-bold border ${
                                    status.type === "success"
                                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                                        : "bg-destructive/10 text-destructive border-destructive/25"
                                }`}
                            >
                                {status.type === "success" ? (
                                    <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                )}
                                <span>{status.message}</span>
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="email-subject" className="block text-xs font-bold text-foreground">
                                Subject
                            </label>
                            <input
                                id="email-subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E.g. New Practical Uploaded: Java Programming"
                                className="w-full px-4 min-h-[44px] rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email-body" className="block text-xs font-bold text-foreground">
                                Message Body
                            </label>
                            <textarea
                                id="email-body"
                                rows={11}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your message here..."
                                className="w-full p-4 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground resize-none placeholder:text-muted-foreground"
                                required
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                                <span>Emails are delivered via Student Hub</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-7 min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm shadow-indigo-500/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" aria-hidden="true" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
