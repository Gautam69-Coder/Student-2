import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Users, Search, Check, AlertCircle, Loader2 } from "lucide-react"
import { sendEmail } from "@/Api/api"
import { useTitle } from "@/hooks/useTitle"

export function MessageSender({ users }) {
    useTitle("Message Sender");
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isAllUsers, setIsAllUsers] = useState(false)
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null) // { type: 'success' | 'error', message: string }
    const [searchTerm, setSearchTerm] = useState("")

    const handleToggleUser = (email) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter(u => u !== email))
        } else {
            setSelectedUsers([...selectedUsers, email])
        }
        setIsAllUsers(false)
    }

    const handleToggleAll = () => {
        setIsAllUsers(!isAllUsers)
        setSelectedUsers([])
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!isAllUsers && selectedUsers.length === 0) {
            setStatus({ type: 'error', message: 'Please select at least one recipient' })
            return
        }
        if (!subject || !body) {
            setStatus({ type: 'error', message: 'Subject and message body are required' })
            return
        }

        setLoading(true)
        setStatus(null)

        try {
            await sendEmail({
                to: isAllUsers ? undefined : selectedUsers,
                subject: subject,
                body: body.replace(/\n/g, '<br/>'),
                isAllUsers: isAllUsers
            });

            setStatus({ type: 'success', message: 'Email sent successfully via Resend!' })

            // Reset form on success
            if (!isAllUsers) setSelectedUsers([])
            setSubject("")
            setBody("")
        } catch (err) {
            console.error(err)
            const errorMsg = err.response?.data?.message || err.message || 'Failed to send email'
            setStatus({ type: 'error', message: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = (users || []).filter(user =>
        (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-5xl mx-auto p-4 select-none">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] text-indigo-500 dark:text-[#CCFF00] bg-transparent flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Message Sender</h2>
            </div>

            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-8">Send announcements or notifications to students directly via email using Resend.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Recipient Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="neo-flat overflow-hidden flex flex-col h-[600px] border-none shadow-none">
                        <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10 dark:bg-slate-900/10">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-500 dark:text-[#CCFF00]" /> Recipients
                            </h3>
                            <button
                                onClick={handleToggleAll}
                                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all mb-4 flex items-center justify-center gap-2 cursor-pointer ${
                                    isAllUsers
                                        ? "shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] text-indigo-600 dark:text-[#CCFF00]"
                                        : "neo-btn text-slate-500 hover:text-slate-600"
                                }`}
                            >
                                {isAllUsers && <Check className="w-4 h-4" />}
                                Send to All Students
                            </button>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-555" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 neo-inset focus:outline-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-transparent">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">No users found</div>
                            ) : (
                                filteredUsers.map(user => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleToggleUser(user.email)}
                                        disabled={isAllUsers}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                                            selectedUsers.includes(user.email)
                                                ? "bg-[#e6eef8] dark:bg-[#1b202e] shadow-[inset_3px_3px_6px_#c8d0e7,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#0f121b,inset_-3px_-3px_6px_#272e41]"
                                                : "neo-flat"
                                        } ${isAllUsers ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-[inset_1.5px_1.5px_3px_#c8d0e7,inset_-1.5px_-1.5px_3px_#ffffff] dark:shadow-[inset_1.5px_1.5px_3px_#0f121b,inset_-1.5px_-1.5px_3px_#272e41] bg-transparent ${
                                                selectedUsers.includes(user.email) ? "text-indigo-500 dark:text-[#CCFF00]" : "text-slate-400"
                                            }`}>
                                                {(user.username || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold line-clamp-1 transition-colors ${selectedUsers.includes(user.email) ? "text-indigo-600 dark:text-[#CCFF00]" : "text-slate-800 dark:text-slate-300"}`}>{user.username || "Unknown"}</p>
                                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{user.email || ""}</p>
                                            </div>
                                        </div>
                                        {selectedUsers.includes(user.email) && <Check className="w-4 h-4 text-indigo-500 dark:text-[#CCFF00]" />}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10 dark:bg-slate-900/10 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isAllUsers ? "All students selected" : `${selectedUsers.length} user(s) selected`}
                        </div>
                    </div>
                </div>

                {/* Right Column: Compose Message */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="neo-flat p-6 space-y-6 border-none shadow-none">
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl flex items-center gap-3 border-none ${
                                    status.type === 'success'
                                        ? "shadow-[inset_2px_2px_4px_rgba(16,185,129,0.1)] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "shadow-[inset_2px_2px_4px_rgba(239,68,68,0.1)] bg-red-500/10 text-red-500 dark:text-red-400"
                                }`}
                            >
                                {status.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-xs font-bold uppercase tracking-wider">{status.message}</p>
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E.g. New Practical Uploaded: Java Programming"
                                className="w-full px-4 py-3.5 neo-inset focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-2">Message Body (HTML Supported)</label>
                            <textarea
                                rows={12}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your message here..."
                                className="w-full px-4 py-4 neo-inset focus:outline-none text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Emails will be sent via Student Hub</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 neo-btn text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

