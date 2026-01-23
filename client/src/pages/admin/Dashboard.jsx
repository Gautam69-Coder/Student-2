
import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import {
    fetchUsers,
    fetchContent,
    fetchSections,
    deleteUser
} from "@/Api/api"

import { GraduationCap, Menu, X } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ManageUsers } from "./ManageUsers"
import { ManageSubjects } from "./ManageSubjects"
import { ManageContent } from "./ManageContent"
import { ManagePracticals } from "./ManagePracticals"
import { ManagePYQs } from "./ManagePYQs"
import { AnalyticsDashboard } from "./AnalyticsDashboard"

const initialSubjects = [
    { name: "Java Programming", code: "CS301", progress: 75, color: "#f97316" },
    { name: "Scilab", code: "CS302", progress: 60, color: "#06b6d4" },
    { name: "Data Structures", code: "CS303", progress: 45, color: "#8b5cf6" },
    { name: "Web Development", code: "CS304", progress: 90, color: "#10b981" },
]

const pendingNotes = [
    { id: 1, title: "Advanced Java Streams", author: "Rahul S.", subject: "Java", date: "Today" },
    { id: 2, title: "Scilab Signal Processing", author: "Priya K.", subject: "Scilab", date: "Yesterday" },
    { id: 3, title: "Graph Algorithms Notes", author: "Vikram T.", subject: "DSA", date: "2 days ago" },
]

export function AdminPanel({ userName, onLogout, onSwitchToStudent }) {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [users, setUsers] = useState([])
    const [subjects, setSubjects] = useState(initialSubjects)
    const [uniqueSubjectSections, setUniqueSubjectSections] = useState([]);

    useEffect(() => {
        const user = fetchUsers();
        user.then((res) => {
            setUsers(res.data);
        });

        const content = fetchContent();
        content.then((res) => {
            setSubjects(res.data)
        });

        const section = fetchSections();
        section.then((res) => {
            setUniqueSubjectSections(res.data)
        });
    }, [])

    return (
        <div className="flex min-h-screen bg-[#FCFAF8]">
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onLogout={onLogout}
            />

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
                    <div className="flex items-center justify-between sm:px-8 px-4 py-5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
                            >
                                <Menu className="w-6 h-6 text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Command Center</h1>
                                <p className="text-sm text-slate-500 font-medium">Welcome back, {userName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onSwitchToStudent}
                                className="inline-flex items-center justify-center rounded-lg gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">Student View</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="sm:p-8 p-4 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<ManageUsers users={users} setUsers={setUsers} subjects={subjects} />} />
                        <Route path="subjects" element={<ManageSubjects subjects={subjects} uniqueSubjectSections={uniqueSubjectSections} setUniqueSubjectSections={setUniqueSubjectSections} />} />
                        <Route path="content" element={<ManageContent pendingNotes={pendingNotes} />} />
                        <Route path="practicals" element={<ManagePracticals uniqueSubjectSections={uniqueSubjectSections} />} />
                        <Route path="pyqs" element={<ManagePYQs />} />
                        <Route path="analytics" element={<AnalyticsDashboard />} />
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Routes>
                </div>
            </main >
        </div >
    )
}
