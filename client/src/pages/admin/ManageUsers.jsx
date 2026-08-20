
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Activity, HardDrive, FileText, Search, Trash, Clock } from "lucide-react"
import { StatsCard } from "@/components/widgets/stats-card"
import { updateUserRole, deleteUser } from "@/Api/api"
import { getTrackerData } from "@/Api/api"
import { useSocket } from "@/context/SocketContext"
import { useTitle } from "@/hooks/useTitle"

export function ManageUsers({ users, setUsers, subjects }) {
    useTitle("Manage Users");
    const [filterRole, setFilterRole] = useState("all")
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("")
    const [isSearch, setIsSearch] = useState(false);
    const [sortBy, setSortBy] = useState("default")
    const itemsPerPage = 8;
    const { onlineUsers } = useSocket();


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
        }).catch(err => {
            console.error(err);
        });
    }, [])


    const filteredUsers = filterRole === "all"
        ? users
        : users.filter(user => user.role === filterRole)

    // const searchUser = users.find(u=> u == search);
    const searchUser = filteredUsers.filter(i => {
        const username = (i.username || "").toLowerCase().split(' ');
        const email = (i.email || "").toLowerCase();
        return username.some(word => word.includes(search.toLowerCase())) || email.includes(search.toLowerCase())
    })

    // console.log(users)  


    // Sorting and Pagination Logic
    const activeItems = search.length > 0 ? searchUser : filteredUsers;
    const sortedUsers = [...activeItems].sort((a, b) => {
        if (sortBy === "most-visited") {
            return (b.visitCount || 0) - (a.visitCount || 0);
        }
        if (sortBy === "least-visited") {
            return (a.visitCount || 0) - (b.visitCount || 0);
        }
        if (sortBy === "alphabetical") {
            return (a.username || "").localeCompare(b.username || "");
        }
        if (sortBy === "recent-visit") {
            const dateA = a.currentVisit ? new Date(a.currentVisit).getTime() : 0;
            const dateB = b.currentVisit ? new Date(b.currentVisit).getTime() : 0;
            return dateB - dateA;
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.max(1, Math.ceil(activeItems.length / itemsPerPage));

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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-4 pt-4 select-none">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid  grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <StatsCard title="Total Users" value={users.length} change="+12%" icon={Users} color="#4F46E5" />
                <StatsCard title="Online Now" value={onlineUsers.length} change="Live" icon={Activity} color="#10b981" />
                <StatsCard title="Storage Used" value="N/A" change="+2.3 GB" icon={HardDrive} color="#f97316" />
                <StatsCard title="Content Items" value={subjects.length} change="+24" icon={FileText} color="#06b6d4" />
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-3 justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Manage Users</h2>
                <div className="flex flex-wrap justify-between w-full sm:mt-6 mt-4 gap-4">
                    <div className="relative flex-1 sm:max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            value={search}
                            placeholder="Search users..."
                            className="w-full pl-11 pr-4 h-10 neo-inset text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            onClick={() => {
                                setIsSearch(true);
                            }}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 px-4 neo-inset text-sm cursor-pointer text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Students</option>
                            <option value="admin">Admins</option>
                            <option value="superadmin">Super Admins</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-10 px-4 neo-inset text-sm cursor-pointer text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="default">Default Order</option>
                            <option value="most-visited">Most Visited</option>
                            <option value="least-visited">Least Visited</option>
                            <option value="recent-visit">Recent Visit</option>
                            <option value="alphabetical">Alphabetical (A-Z)</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="neo-flat overflow-hidden sm:w-full w-sm border-none shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-100/10 dark:bg-slate-900/10">
                                <th className="text-left sm:px-6 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                                <th className="text-left sm:px-6 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                                <th className="text-left sm:px-6 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Online Visits</th>
                                <th className="text-left sm:px-6 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ">Current Visit</th>
                                <th className="text-right sm:px-6 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user) => {
                                const isOnline = onlineUsers && onlineUsers.includes(user._id);

                                return (
                                    <tr key={user._id} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/10 dark:hover:bg-slate-900/10 transition-colors">
                                        <td className="sm:px-6 px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    {user.avatar ? (
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">
                                                            <img src={user.avatar} className="rounded-xl object-cover w-full h-full" alt="avatar" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">
                                                            {(user.username || "").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {isOnline && (
                                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#e6eef8] dark:border-[#1b202e] rounded-full shadow-sm animate-pulse" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-slate-900 dark:text-white text-[15px]">{user.username || "Unknown"}</p>
                                                        {isOnline ? (
                                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-wider bg-green-500/10 px-1.5 py-0.5 rounded">Online</span>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-400/10 px-1.5 py-0.5 rounded">Offline</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 sm:block hidden">{user.email || ""}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="sm:px-6 px-4 py-4">
                                            {user.role !== "superadmin" ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="sm:w-28 w-20 h-8 px-2 text-xs font-bold rounded-xl neo-btn cursor-pointer focus:outline-none"
                                                >
                                                    <option value="user">Student</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className="inline-block sm:w-28 w-20 py-1.5 text-center text-[10px] tracking-wider uppercase font-black rounded-lg bg-amber-500 text-white shadow-sm">
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="sm:px-6 px-4 py-4">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{formatCount(user.visitCount)}</span>
                                        </td>
                                        <td className="sm:px-6 px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {user.currentVisit ? new Date(user.currentVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold mt-0.5">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    {user.currentVisitTime || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="sm:px-6 px-4 py-4 text-right">
                                            {user.role !== "superadmin" ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg neo-btn text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 select-none">👑</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-5 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-100/10 dark:bg-slate-900/10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Showing <span className="text-slate-700 dark:text-slate-300">{indexOfFirstItem + 1}</span> - <span className="text-slate-700 dark:text-slate-300">{Math.min(indexOfLastItem, activeItems.length)}</span> of <span className="text-slate-700 dark:text-slate-300">{activeItems.length}</span> Users
                    </p>
                    <div className="flex gap-2.5 items-center">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4.5 py-2 text-xs font-bold rounded-xl transition-all ${currentPage === 1
                                ? "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                : "neo-btn text-slate-600 dark:text-slate-400"}`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${currentPage === number
                                    ? "bg-[#e6eef8] dark:bg-[#1b202e] shadow-[inset_3px_3px_6px_#c8d0e7,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#0f121b,inset_-3px_-3px_6px_#272e41] text-[#4F46E5] dark:text-[#CCFF00]"
                                    : "neo-btn text-slate-600 dark:text-slate-400"}`}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4.5 py-2 text-xs font-bold rounded-xl transition-all ${currentPage === totalPages
                                ? "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                : "neo-btn text-slate-600 dark:text-slate-400"}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
