
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Activity, HardDrive, FileText, Search, Trash, Clock } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { updateUserRole, deleteUser } from "@/Api/api"
import { getTrackerData } from "../../Api/api"
import { useSocket } from "@/context/SocketContext"
import { useTitle } from "@/hooks/useTitle"

export function ManageUsers({ users, setUsers, subjects }) {
    useTitle("Manage Users");
    const [filterRole, setFilterRole] = useState("all")
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const { onlineUsers } = useSocket()

    const handleDeleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return
        deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId))
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ))
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    }

    useEffect(() => {
        getTrackerData().then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        });
    }, [])


    const filteredUsers = filterRole === "all"
        ? users
        : users.filter(user => user.role === filterRole)


    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatCount = (num) => {
        if (!num) return 0;
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <StatsCard title="Total Users" value={users.length} change="+12%" icon={Users} color="#0f172a" />
                <StatsCard title="Online Now" value={onlineUsers.length} change="Live" icon={Activity} color="#10b981" />
                <StatsCard title="Storage Used" value="N/A" change="+2.3 GB" icon={HardDrive} color="#f97316" />
                <StatsCard title="Content Items" value={subjects.length} change="+24" icon={FileText} color="#06b6d4" />
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-3 justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manage Users</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-64 pl-10 pr-4 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => { setFilterRole(e.target.value) }}
                        className="h-10 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 cursor-pointer text-slate-900 dark:text-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Students</option>
                        <option value="admin">Admins</option>
                        <option value="superadmin">Super Admins</option>
                    </select>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 overflow-x-auto sm:w-full w-sm rounded-xl  border border-[#E5E5E5] dark:border-slate-800 shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Online Visits</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ">Current Visit</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ">Last Visit</th>
                            <th className="text-right sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user) => {
                            const isOnline = onlineUsers.includes(user._id);
                            const activityColor = user.role === 'admin' ? '#7C3AED' : (isOnline ? '#22C55E' : '#64748B');

                            return (
                                <tr key={user._id} className="border-b  border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="sm:px-6 px-2 py-2 sm:py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                {isOnline && (
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm animate-pulse" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="sm:flex  items-center gap-2">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-[15px]">{user.username}</p>
                                                    {isOnline ? (
                                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• Offline</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 sm:block hidden">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="sm:px-6 px-2 py-2 sm:py-4 flex items-center">
                                        {user.role !== "superadmin" ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className={`sm:w-28 w-20 h-6 sm:h-8 sm:px-5 px-2 text-xs font-semibold rounded-md border-none focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 cursor-pointer ${user.role === "admin"
                                                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                                    : "bg-slate-100 dark:bg-slate-800 text-black dark:text-white"
                                                    }`}
                                            >
                                                <option value="user">Student</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <div>
                                                <span className="sm:w-28 w-20 h-6 py-2  sm:px-5 px-2 text-[12px] text-center font-semibold rounded-md border-none bg-yellow-500 text-white">{user.role}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="sm:px-6 px-2 py-2 sm:py-4">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCount(user.visitCount)}</span>
                                    </td>
                                    <td className="sm:px-6 px-2 py-2 sm:py-4 ">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {user.currentVisit ? new Date(user.currentVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                                                    {/* {user.currentVisit} */}
                                                </span>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {user.currentVisitTime || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="sm:px-6 px-2 py-2 sm:py-4 ">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {user.lastVisit ? new Date(user.lastVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                                                    {/* {user.currentVisit} */}
                                                </span>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {user.lastVisitTime || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="sm:px-6 py-4">
                                        {user.role !== "superadmin" ? (
                                            <div className="flex sm:justify-end justify-center gap-2">
                                                <button onClick={() => handleDeleteUser(user._id)} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex sm:justify-end justify-center gap-2">
                                                <span className="text-slate-400">😂</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-semibold text-slate-900 dark:text-white">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredUsers.length}</span> users
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${currentPage === 1
                                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                : "border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"}`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-10 h-10 text-sm font-bold rounded-lg transition-all ${currentPage === number
                                    ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${currentPage === totalPages
                                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                : "border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
