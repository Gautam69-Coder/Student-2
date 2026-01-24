
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Users, Activity, HardDrive, FileText, Search, Trash } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { SparklineChart } from "@/components/admin/sparkline-chart"
import { updateUserRole, deleteUser } from "@/Api/api"

export function ManageUsers({ users, setUsers, subjects }) {
    const [filterRole, setFilterRole] = useState("all")

    const handleDeleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return
        deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId))
    }

    const handleRoleChange = async (userId, newRole) => {
        console.log(userId, newRole);
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ))
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    }

    const filteredUsers = filterRole === "all"
        ? users
        : users.filter(user => user.role === filterRole)

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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <StatsCard title="Total Users" value={users.length} change="+12%" icon={Users} color="#0f172a" />
                <StatsCard title="Daily Active" value="N/A" change="+8%" icon={Activity} color="#10b981" />
                <StatsCard title="Storage Used" value="N/A" change="+2.3 GB" icon={HardDrive} color="#f97316" />
                <StatsCard title="Content Items" value={subjects.length} change="+24" icon={FileText} color="#06b6d4" />
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-3 justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Users</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-64 pl-10 pr-4 h-10 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Students</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-xl overflow-hidden border border-[#E5E5E5] shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ">Visits</th>
                            <th className="text-left sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:block hidden">Activity</th>
                            {/* <th className="text-left px-6 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Active</th> */}
                            <th className="text-right sm:px-6 px-1 py-2 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="sm:px-6 px-2 py-2 sm:py-4">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-[15px]">{user.username}</p>
                                        <p className="text-sm text-slate-500 sm:block hidden">{user.email}</p>
                                    </div>
                                </td>
                                <td className="sm:px-6 px-2 py-2 sm:py-4 flex items-center">
                                    {user.role !== "superadmin" ? (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className={`sm:w-28 w-20 h-6 sm:h-8 sm:px-5 px-2 text-xs font-semibold rounded-md border-none focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer ${user.role === "admin"
                                                ? "bg-slate-900 text-white"
                                                : "bg-slate-100 text-black"
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
                                    <span className="font-semibold text-slate-700">{user.visitCount}</span>
                                </td>
                                <td className="sm:px-6 px-2 py-2 sm:py-4 sm:block hidden">
                                    <SparklineChart color={user.role === "admin" ? "#0f172a" : "#64748b"} />
                                </td>
                                {/* <td className="px-6 py-4 text-slate-500 text-sm font-medium">{user.lastActive}</td> */}
                                <td className="sm:px-6 py-4">
                                    <div className="flex sm:justify-end justify-center gap-2">
                                        <button onClick={() => handleDeleteUser(user._id)} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                                            {user.role !== "superadmin" ? <Trash className="w-4 h-4" /> : "😂"}
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    )
}
