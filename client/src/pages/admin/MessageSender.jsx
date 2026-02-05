import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Users, User, Check, AlertCircle, Loader2 } from "lucide-react"
import { sendEmail } from "@/Api/api"
import axios from "axios"

export function MessageSender({ users }) {
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
            // Updated to use the new independent email server
            const recipientEmails = isAllUsers ? users.map(u => u.email) : selectedUsers;

            await axios.post('http://localhost:5003/api/send-broadcast', {
                to: recipientEmails,
                subject: subject,
                body: body.replace(/\n/g, '<br/>'),
                isAllUsers: isAllUsers
            });

            setStatus({ type: 'success', message: 'Email sent successfully via new Email Server!' })

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

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-100">
                    <Mail className="w-5 h-5 text-white dark:text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Message Sender</h2>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Send announcements or notifications to students directly via email using Resend.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Recipient Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Recipients
                            </h3>
                            <button
                                onClick={handleToggleAll}
                                className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all mb-4 flex items-center justify-center gap-2 ${isAllUsers
                                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm"
                                    }`}
                            >
                                {isAllUsers && <Check className="w-4 h-4" />}
                                Send to All Students
                            </button>
                            <div className="relative group">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1 dark:bg-slate-900/50">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">No users found</div>
                            ) : (
                                filteredUsers.map(user => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleToggleUser(user.email)}
                                        disabled={isAllUsers}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${selectedUsers.includes(user.email)
                                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 shadow-sm"
                                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                            } ${isAllUsers ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedUsers.includes(user.email) ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                                }`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold line-clamp-1 transition-colors ${selectedUsers.includes(user.email) ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-300"}`}>{user.username}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{user.email}</p>
                                            </div>
                                        </div>
                                        {selectedUsers.includes(user.email) && <Check className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {isAllUsers ? "All students selected" : `${selectedUsers.length} user(s) selected`}
                        </div>
                    </div>
                </div>

                {/* Right Column: Compose Message */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success'
                                    ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
                                    }`}
                            >
                                {status.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm font-semibold">{status.message}</p>
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E.g. New Practical Uploaded: Java Programming"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:focus:ring-slate-100/10 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message Body (HTML Supported)</label>
                            <textarea
                                rows={12}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your message here..."
                                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:focus:ring-slate-100/10 transition-all font-medium resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Emails will be sent via Student Hub</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
