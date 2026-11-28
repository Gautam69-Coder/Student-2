import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Activity, HardDrive, FileText, Search, Trash, Clock } from "lucide-react";
import { StatsCard } from "@/components/widgets/stats-card";
import { updateUserRole, deleteUser } from "@/Api/api";
import { useSocket } from "@/context/SocketContext";
import { useTitle } from "@/hooks/useTitle";

export function ManageUsers({ users, setUsers, subjects }) {
    useTitle("Manage Users");
    const [filterRole, setFilterRole] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const itemsPerPage = 8;
    const { onlineUsers } = useSocket();

    const handleDeleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)));
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const filteredUsers = filterRole === "all" ? users : users.filter((user) => user.role === filterRole);

    const searchUser = filteredUsers.filter((i) => {
        const username = (i.username || "").toLowerCase().split(" ");
        const email = (i.email || "").toLowerCase();
        return username.some((word) => word.includes(search.toLowerCase())) || email.includes(search.toLowerCase());
    });

    const activeItems = search.length > 0 ? searchUser : filteredUsers;
    const sortedUsers = [...activeItems].sort((a, b) => {
        if (sortBy === "most-visited") return (b.visitCount || 0) - (a.visitCount || 0);
        if (sortBy === "least-visited") return (a.visitCount || 0) - (b.visitCount || 0);
        if (sortBy === "alphabetical") return (a.username || "").localeCompare(b.username || "");
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatCount = (num) => {
        if (!num) return 0;
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        return num;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Users" value={users.length} change="+12%" icon={Users} color="#4F46E5" />
                <StatsCard title="Online Now" value={onlineUsers.length} change="Live" icon={Activity} color="#10B981" />
                <StatsCard title="Storage Used" value="Cloud" change="Active" icon={HardDrive} color="#F59E0B" />
                <StatsCard title="Content Items" value={subjects.length} change="Verified" icon={FileText} color="#6366F1" />
            </div>

            <div className="surface-card rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                        Manage Users
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                            aria-hidden="true"
                        />
                        <input
                            type="text"
                            value={search}
                            aria-label="Search users"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 min-h-[42px] rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex gap-2.5">
                        <select
                            aria-label="Filter by role"
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="min-h-[42px] px-3.5 rounded-xl bg-background border border-input text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Students</option>
                            <option value="admin">Admins</option>
                            <option value="superadmin">Super Admins</option>
                        </select>
                        <select
                            aria-label="Sort users"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="min-h-[42px] px-3.5 rounded-xl bg-background border border-input text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="default">Default Order</option>
                            <option value="most-visited">Most Visited</option>
                            <option value="least-visited">Least Visited</option>
                            <option value="recent-visit">Recent Visit</option>
                            <option value="alphabetical">Alphabetical (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="surface-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[680px]">
                        <thead>
                            <tr className="border-b border-border bg-secondary/40">
                                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    User
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Role
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Online Visits
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Current Visit
                                </th>
                                <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user) => {
                                const isOnline = onlineUsers && onlineUsers.includes(user._id);

                                return (
                                    <tr key={user._id} className="border-b border-border hover:bg-secondary/40 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            className="w-10 h-10 rounded-xl object-cover border border-border"
                                                            alt={user.username || "avatar"}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-primary border border-indigo-500/20 flex items-center justify-center font-bold">
                                                            {(user.username || "U").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {isOnline && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-foreground text-sm">
                                                            {user.username || "Unknown"}
                                                        </p>
                                                        {isOnline ? (
                                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-500/12 px-1.5 py-0.5 rounded">
                                                                Online
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase bg-secondary px-1.5 py-0.5 rounded">
                                                                Offline
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                                        {user.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {user.role !== "superadmin" ? (
                                                <select
                                                    aria-label={`Change role for ${user.username}`}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="min-h-[36px] px-2.5 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    <option value="user">Student</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className="inline-block px-3 py-1 text-[10px] tracking-wider uppercase font-bold rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-bold text-sm text-foreground tabular-nums">
                                                {formatCount(user.visitCount)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground tabular-nums">
                                                    {user.currentVisit
                                                        ? new Date(user.currentVisit).toLocaleDateString("en-GB", {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          })
                                                        : "Never"}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 tabular-nums">
                                                    <Clock className="w-3 h-3" aria-hidden="true" />
                                                    {user.currentVisitTime || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {user.role !== "superadmin" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    aria-label={`Delete ${user.username}`}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-muted-foreground">Owner</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-border flex flex-col sm:flex-row gap-3 items-center justify-between bg-secondary/30">
                    <p className="text-xs font-semibold text-muted-foreground tabular-nums">
                        Showing <span className="text-foreground">{activeItems.length === 0 ? 0 : indexOfFirstItem + 1}</span> –{" "}
                        <span className="text-foreground">{Math.min(indexOfLastItem, activeItems.length)}</span> of{" "}
                        <span className="text-foreground">{activeItems.length}</span> Users
                    </p>
                    <div className="flex gap-1.5 items-center flex-wrap">
                        <button
                            type="button"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3.5 min-h-[36px] text-xs font-bold rounded-xl border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                type="button"
                                onClick={() => paginate(number)}
                                className={`w-9 h-9 text-xs font-bold rounded-xl border transition-colors tabular-nums ${
                                    currentPage === number
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                }`}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3.5 min-h-[36px] text-xs font-bold rounded-xl border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
