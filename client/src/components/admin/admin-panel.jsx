
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
// Redundant UI component imports removed as per request
import {
    Users,
    FileText,
    FlaskConical,
    Upload,
    Search,
    Check,
    X,
    Eye,
    Edit3,
    HardDrive,
    Activity,
    GraduationCap,
    Trash,
    CloudCog,
    Pen,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { StatsCard } from "./stats-card"
import { SparklineChart } from "./sparkline-chart"
import {
    fetchUsers,
    updateUserRole,
    fetchContent,
    deleteUser,
    fetchSections,
    createSection,
    deleteSection,
    fetchPracticals,
    createPractical,
    updatePractical,
    deletePractical,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
} from "../../Api/api"




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
    const [currentView, setCurrentView] = useState("users")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [users, setUsers] = useState([])
    const [filterRole, setFilterRole] = useState("all")
    const [subjects, setSubjects] = useState(initialSubjects)
    const [newSubject, setNewSubject] = useState("")
    const [uniqueSubjectSections, setUniqueSubjectSections] = useState([]);
    const [newPractical, setNewPractical] = useState({
        practicalNumber: '',
        section: '',
        questions: [{ question: '', code: '' }]
    });
    const [practicals, setPracticals] = useState([]);
    const [editPracticalId, setEditPracticalId] = useState(null);




    const handleDeleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return
        deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId))
    }

    const handleAddQuestion = () => {
        setNewPractical({
            ...newPractical,
            questions: [...newPractical.questions, { question: '', code: '' }]
        });
    };


    const handleAddSection = async (sectionName) => {
        try {
            const res = await createSection(sectionName);
            setUniqueSubjectSections([...uniqueSubjectSections, res.data])
        } catch (error) {
            console.error(error);
        }
    };


    // Practical Section
    const handleRemoveQuestion = (index) => {
        setNewPractical({
            ...newPractical,
            questions: newPractical.questions.filter((_, i) => i !== index)
        });
    };

    const handleAddPractical = async (e) => {
        e.preventDefault();
        try {
            if (editPracticalId) {
                const res = await updatePractical(editPracticalId, newPractical);
                console.log(res.data);
                setEditPracticalId(null);
            } else {
                const res = await createPractical(newPractical);
                // console.log(res.data);
                setNewPractical({ practicalNumber: '', section: '', questions: [{ question: '', code: '' }] });
                alert('Practical added successfully!');
            }
        } catch (error) {
            console.error('Error adding practical:', error);
            alert('Failed to add practical');
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId);
            setUniqueSubjectSections(uniqueSubjectSections.filter(section => section._id !== sectionId))
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePractical = async (practical) => {
        try {
            setEditPracticalId(practical._id);
            setNewPractical({
                practicalNumber: practical.practicalNumber,
                section: practical.section,
                questions: practical.questions.length > 0 ? practical.questions : [{ question: '', code: '' }]
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePractical = async (practicalId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this practical?")) return;
            await deletePractical(practicalId);
            setPracticals(practicals.filter(practical => practical._id !== practicalId))
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchPracticals = async () => {
        try {
            const res = await fetchPracticals();
            console.log(res.data);
            setPracticals(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchPracticals();
    }, [newPractical, editPracticalId]);




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

    useEffect(() => {
        const user = fetchUsers();
        user.then((res) => {
            setUsers(res.data);
            // console.log(res.data);
        });

        const content = fetchContent();
        content.then((res) => {
            setSubjects(res.data)
            // console.log(res.data)
            // const uniqueSections = [...new Set(res.data.map(item => item.section))];
            // setUniqueSubjectSections(uniqueSections);
        });

        const section = fetchSections();
        section.then((res) => {
            setUniqueSubjectSections(res.data)
            console.log(res.data)
        });


        // const createPractical = fetchPracticals();
        // createPractical.then((res) => {
        //     console.log(res.data);
        // });

        // const createNote = fetchNotes();
        // createNote.then((res) => {
        //     console.log(res.data);
        // });


    }, [])

    return (
        <div className="flex min-h-screen bg-[#FCFAF8]">
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                currentView={currentView}
                setCurrentView={setCurrentView}
                onLogout={onLogout}
            />

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
                    <div className="flex items-center justify-between px-8 py-5">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Command Center</h1>
                            <p className="text-sm text-slate-500 font-medium">Welcome back, {userName}</p>
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
                    {/* Analytics Overview - Clean Line Charts style */}


                    {/* Main Content */}
                    {currentView === "subjects" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Subjects</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                {/* Add Subject Form */}
                                <motion.div variants={itemVariants} className="lg:col-span-1 border border-[#E5E5E5] bg-white rounded-xl p-6 shadow-sm h-fit">
                                    <h3 className="font-bold text-slate-900 mb-6">Add New Subject</h3>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-600">Subject Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Machine Learning"
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                className="w-full px-3 h-10 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg text-sm transition-all"
                                            />
                                        </div>


                                        <button
                                            onClick={() => handleAddSection(newSubject)}
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg h-11 mt-2 transition-colors active:scale-[0.98]"
                                        >
                                            Create Subject
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Subjects List */}
                                <motion.div variants={itemVariants} className="lg:col-span-2 border border-[#E5E5E5] bg-white rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sr No.</th>
                                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Sections</th>
                                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Practical Notes</th>
                                                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uniqueSubjectSections.map((sub, idx) => (
                                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-slate-900">{idx + 1}</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{sub.name}</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{subjects.filter((s) => s.section == sub.name).length}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                onClick={() => handleDeleteSection(sub._id)}
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === "users" && (
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
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
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
                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Visits</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Activity</th>
                                            {/* <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Active</th> */}
                                            <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{user.username}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 flex items-center">
                                                    {user.role !== "superadmin" ? (
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                            className={`w-28 h-8 px-5 text-xs font-semibold rounded-md border-none focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer ${user.role === "admin"
                                                                ? "bg-slate-900 text-white"
                                                                : "bg-slate-100 text-black"
                                                                }`}
                                                        >
                                                            <option value="user">Student</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        <span className="w-28 h-8 p-2 text-[12px] text-center font-semibold rounded-md border-none bg-yellow-500 text-white">{user.role}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-slate-700">{user.visitCount}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <SparklineChart color={user.role === "admin" ? "#0f172a" : "#64748b"} />
                                                </td>
                                                {/* <td className="px-6 py-4 text-slate-500 text-sm font-medium">{user.lastActive}</td> */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleDeleteUser(user._id)} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                                                            <Trash className="w-4 h-4" />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        </motion.div>
                    )}

                    {currentView === "content" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Pending Approvals</h2>
                                <p className="text-slate-500">Review and approve peer-to-peer notes submissions</p>
                            </motion.div>

                            <div className="space-y-4">
                                {pendingNotes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        variants={itemVariants}
                                        className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-slate-300 transition-all shadow-sm flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                                                <FileText className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{note.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium mt-1">
                                                    By <span className="text-slate-900">{note.author}</span> • {note.subject} • {note.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                                <Eye className="w-4 h-4 mr-1.5" /> Preview
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                                                <Check className="w-4 h-4 mr-1.5" /> Approve
                                            </button>
                                            <button className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                                                <X className="w-4 h-4 mr-1.5" /> Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentView === "practicals" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Add New Practical</h2>
                                <p className="text-slate-500">Create a new practical assignment with code template</p>
                            </motion.div>

                            <form onSubmit={handleAddPractical}>
                                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm ">
                                    <div className="space-y-6">
                                        <div className="flex justify-between w-full gap-4">
                                            <div className="w-full">
                                                <label htmlFor="practical-subject" className="text-sm font-medium text-slate-700">
                                                    Subject
                                                </label>
                                                <select className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg appearance-none cursor-pointer"
                                                    value={newPractical.section}
                                                    onChange={e => setNewPractical({ ...newPractical, section: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select subject</option>
                                                    {uniqueSubjectSections.map((section) => (
                                                        <option key={section._id} value={section.name}>
                                                            {section.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="w-full">
                                                <label htmlFor="practical-question" className="text-sm font-medium text-slate-700">
                                                    Practical No
                                                </label>
                                                <input
                                                    type="text"
                                                    id="Practical No"
                                                    value={newPractical.practicalNumber}
                                                    onChange={e => setNewPractical({ ...newPractical, practicalNumber: e.target.value })}
                                                    placeholder="Write the practical question/problem statement..."
                                                    className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="border-blue-400 border-dashed border rounded-lg p-4">
                                            {newPractical.questions.map((question, index) => (
                                                <React.Fragment key={index}>
                                                    <div>
                                                        <div className="flex justify-between w-full">
                                                            <label htmlFor="practical-question" className="  text-sm font-medium text-slate-700">
                                                                Question {index + 1}
                                                            </label>
                                                            {newPractical.questions.length > 1 && (
                                                                <Trash
                                                                    className="w-4 h-4 text-red-500 cursor-pointer"
                                                                    onClick={() => handleRemoveQuestion(index)}
                                                                />
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            id="Practical Question"
                                                            value={newPractical.questions[index].question}
                                                            onChange={(e) => {
                                                                const updatedQuestions = [...newPractical.questions];
                                                                updatedQuestions[index] = {
                                                                    ...updatedQuestions[index],
                                                                    question: e.target.value,
                                                                };

                                                                setNewPractical({
                                                                    ...newPractical,
                                                                    questions: updatedQuestions,
                                                                });
                                                            }}
                                                            required
                                                            placeholder="Write the practical question/problem statement..."
                                                            className="mt-2 w-full px-4 h-11 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="practical-code" className="text-sm font-medium text-slate-700">
                                                            Code Template
                                                        </label>
                                                        <textarea
                                                            id="practical-code"
                                                            value={newPractical.questions[index].code}
                                                            onChange={(e) => {
                                                                const updatedQuestions = [...newPractical.questions];
                                                                updatedQuestions[index] = {
                                                                    ...updatedQuestions[index],
                                                                    code: e.target.value,
                                                                };

                                                                setNewPractical({
                                                                    ...newPractical,
                                                                    questions: updatedQuestions,
                                                                });
                                                            }}
                                                            required
                                                            placeholder="// Starter code for students..."
                                                            className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg min-h-40 transition-all"
                                                        />
                                                    </div>

                                                    {newPractical.questions.length > 1 && (
                                                        <hr className="border-slate-400 my-4" />
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            <button className="w-full bg-slate-900 mt-4 hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                                                onClick={handleAddQuestion}
                                                type="button"
                                            >
                                               + Add Question
                                            </button>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-slate-900 mt-4 hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                                <FlaskConical className="w-4 h-4" /> {editPracticalId ? 'Update Practical' : 'Add Practical'}
                                            </button>
                                            {editPracticalId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewPractical({
                                                            practicalNumber: '',
                                                            subject: '',
                                                            questions: [{ question : "", code : "" }]
                                                        })
                                                        setEditPracticalId(null)
                                                    }}
                                                    className="w-fit px-4 bg-blue-500 mt-4 hover:bg-blue-600 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                                    <FlaskConical className="w-4 h-4" /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>


                                </motion.div>
                            </form>
                            <div>
                                <div className="pb-2 mb-2">
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Practicals</h2>
                                    <p className="text-slate-500">All Added Practicals</p>
                                </div>
                                <div className="bg-white border-2 p-4 rounded-2xl">
                                    <table className="w-full  ">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-center">Practical Name</th>
                                                <th className="px-4 py-2 text-center">Subject</th>
                                                <th className="px-4 py-2 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        {practicals.sort((a, b) => b.practicalNumber - a.practicalNumber).map((practical) => (
                                            <tr className="border-b border-[#E5E5E5]">
                                                <td className="px-4 py-2 text-center">{practical.practicalNumber}</td>
                                                <td className="px-4 py-2 text-center">{practical.section}</td>
                                                <td className="flex justify-center gap-2 mb-2 mt-2">
                                                    <button onClick={() => handleUpdatePractical(practical)} className="bg-slate-900 w-fit sm:px-4 px-2 sm:py-1  hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                                        <Pen className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeletePractical(practical._id)} className="bg-slate-900 w-fit sm:px-4 px-2 sm:py-1  hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === "pyqs" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Upload PYQs</h2>
                                <p className="text-slate-500">Add previous year question papers for students</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm max-w-2xl">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="pyq-subject" className="text-sm font-medium text-slate-700">
                                                Subject
                                            </label>
                                            <select className="mt-2 w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg appearance-none cursor-pointer">
                                                <option value="">Select</option>
                                                <option value="java">Java Programming</option>
                                                <option value="scilab">Scilab</option>
                                                <option value="dsa">Data Structures</option>
                                                <option value="webdev">Web Development</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="pyq-year" className="text-sm font-medium text-slate-700">
                                                Year
                                            </label>
                                            <select className="mt-2 w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg appearance-none cursor-pointer">
                                                <option value="">Select</option>
                                                <option value="2024">2024</option>
                                                <option value="2023">2023</option>
                                                <option value="2022">2022</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="pyq-semester" className="text-sm font-medium text-slate-700">
                                            Semester
                                        </label>
                                        <select className="mt-2 w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded-lg appearance-none cursor-pointer">
                                            <option value="">Select semester</option>
                                            <option value="spring">Spring</option>
                                            <option value="fall">Fall</option>
                                            <option value="summer">Summer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Upload File</label>
                                        <div className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer">
                                            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                            <p className="text-sm text-slate-600 font-medium">
                                                <span className="text-slate-900 underline decoration-slate-300 underline-offset-4">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-slate-400 mt-2">PDF files only, up to 20MB</p>
                                        </div>
                                    </div>

                                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
                                        <Upload className="w-4 h-4" /> Upload PYQ
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {currentView === "analytics" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6">User Growth</h3>
                                    <div className="h-56 flex items-end justify-between gap-3">
                                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                                className="flex-1 bg-slate-900 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6">Content Distribution</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: "Notes", value: 45, color: "#0f172a" },
                                            { label: "Practicals", value: 30, color: "#64748b" },
                                            { label: "PYQs", value: 25, color: "#cbd5e1" },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-slate-700">{item.label}</span>
                                                    <span className="text-slate-900">{item.value}%</span>
                                                </div>
                                                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.value}%` }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main >
        </div >
    )
}
