import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Users, User, Check, AlertCircle, Loader2 } from "lucide-react"
import { sendEmail } from "@/Api/api"

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
            const emailData = {
                to: isAllUsers ? [] : selectedUsers,
                isAllUsers: isAllUsers,
                subject: subject,
                body: body.replace(/\n/g, '<br/>')
            }

            const res = await sendEmail(emailData)
            setStatus({ type: 'success', message: res.data.msg || 'Email sent successfully!' })

            // Reset form on success
            if (!isAllUsers) setSelectedUsers([])
            setSubject("")
            setBody("")
        } catch (err) {
            console.error(err)
            const errorMsg = err.response?.data?.msg || err.response?.data?.error?.message || 'Failed to send email'
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
                <div className="p-2 rounded-lg bg-blue-500">
                    <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Message Sender</h2>
            </div>

            <p className="text-slate-500 mb-8 font-medium">Send announcements or notifications to students directly via email using Resend.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Recipient Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Recipients
                            </h3>
                            <button
                                onClick={handleToggleAll}
                                className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all mb-4 flex items-center justify-center gap-2 ${isAllUsers
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                                    }`}
                            >
                                {isAllUsers && <Check className="w-4 h-4" />}
                                Send to All Students
                            </button>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-sm">No users found</div>
                            ) : (
                                filteredUsers.map(user => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleToggleUser(user.email)}
                                        disabled={isAllUsers}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${selectedUsers.includes(user.email)
                                            ? "bg-blue-50 border border-blue-100"
                                            : "hover:bg-slate-50"
                                            } ${isAllUsers ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedUsers.includes(user.email) ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                                                }`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{user.username}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1">{user.email}</p>
                                            </div>
                                        </div>
                                        {selectedUsers.includes(user.email) && <Check className="w-4 h-4 text-blue-500" />}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
                            {isAllUsers ? "All students selected" : `${selectedUsers.length} user(s) selected`}
                        </div>
                    </div>
                </div>

                {/* Right Column: Compose Message */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success'
                                    ? "bg-green-50 border border-green-100 text-green-700"
                                    : "bg-red-50 border border-red-100 text-red-700"
                                    }`}
                            >
                                {status.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm font-semibold">{status.message}</p>
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E.g. New Practical Uploaded: Java Programming"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message Body (HTML Supported)</label>
                            <textarea
                                rows={12}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your message here..."
                                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all font-medium resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-slate-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Emails will be sent via Student Hub</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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
