
// import React, { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import {
//     fetchSections,
//     fetchNotes,
//     fetchPracticals,
//     fetchContent,
// } from "@/Api/api"

// import { Upload, Search, Command, ChevronRight, Sparkles, ArrowUpRight, Users } from "lucide-react"
// import { StudentSidebar } from "./student-sidebar"
// import { SubjectCard } from "./subject-card"
// import { PracticalCard } from "./practical-card"
// import { PYQSection } from "./pyq-section"
// import { NotesSection } from "./notes-section"
// import { UploadModal } from "./upload-modal"
// import { userDetail } from "@/lib/user";




// const recentPracticals = [
//     {
//         title: "Implement Stack using Arrays",
//         subject: "Data Structures",
//         code: `class Stack {
//   private int[] arr;
//   private int top;
  
//   public Stack(int size) {
//     arr = new int[size];
//     top = -1;
//   }
  
//   public void push(int x) {
//     arr[++top] = x;
//   }
// }`,
//     },
//     {
//         title: "Matrix Multiplication",
//         subject: "Scilab",
//         code: `A = [1 2; 3 4];
// B = [5 6; 7 8];
// C = A * B;
// disp(C);`,
//     },
// ]

// export function StudentDashboard({ userName, onLogout, onSwitchToAdmin }) {
//     const [currentView, setCurrentView] = useState("home")
//     const [sidebarOpen, setSidebarOpen] = useState(true)
//     const [uploadModalOpen, setUploadModalOpen] = useState(false);
//     const [role, setrole] = useState("user");
//     const [subjects, setSubjects] = useState([]);
//     const [practicals, setPracticals] = useState([]);

//     const fetchSubjects = () => {
//         const section = fetchSections();
//         section.then((res) => {
//             setSubjects(res.data)
//             // console.log(res.data)
//         });
//     }

//     const fetchPractical = () => {
//         const practical = fetchPracticals();
//         practical.then((res) => {
//             setPracticals(res.data)
//             // console.log(res.data)
//         });
//     }

//     useEffect(() => {
//         fetchSubjects();
//         fetchPractical();
//     }, [])


//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: { staggerChildren: 0.1 },
//         },
//     }

//     useEffect(() => {
//         userDetail().then((user) => {
//             setrole(user.role);
//         })
//     }, [])



//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 },
//     }

//     return (
//         <div className="flex min-h-screen bg-[#FCFAF8]">
//             <StudentSidebar
//                 isOpen={sidebarOpen}
//                 setIsOpen={setSidebarOpen}
//                 currentView={currentView}
//                 setCurrentView={setCurrentView}
//                 onLogout={onLogout}
//             />

//             <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
//                 {/* Header - Minimalist White Bar */}
//                 <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
//                     <div className="flex items-center justify-between px-8 py-4">
//                         <button
//                             onClick={() => setSidebarOpen(!sidebarOpen)}
//                             className="p-2 rounded-md hover:bg-slate-100 transition-colors lg:hidden"
//                         >
//                             <ChevronRight className={`w-5 h-5 text-slate-600 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
//                         </button>

//                         {/* Search Bar - Command K Style */}
//                         <div className="flex-1 max-w-2xl mx-6">
//                             <div className="relative group">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search notes, practicals, PYQs..."
//                                     className="w-full h-10 pl-10 pr-20 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 rounded-lg shadow-sm transition-all text-sm"
//                                 />
//                                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-medium text-slate-400">
//                                     <Command className="w-3 h-3" />
//                                     <span>K</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setUploadModalOpen(true)}
//                                 className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 h-10 rounded-lg gap-2 shadow-sm transition-all active:scale-[0.98] text-sm font-medium"
//                             >
//                                 <Upload className="w-4 h-4" />
//                                 <span className="hidden sm:inline">Share Notes</span>
//                             </button>
//                             {role === "admin" || role === "superadmin" && (
//                                 <button
//                                     onClick={onSwitchToAdmin}
//                                     className="flex items-center justify-center rounded-lg gap-2 border border-slate-200 bg-white px-4 h-10 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
//                                 >
//                                     <Users className="w-4 h-4" />
//                                     <span className="hidden sm:inline">Admin View</span>
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </header>

//                 {/* Content */}
//                 <div className="p-8 max-w-7xl mx-auto">
//                     {currentView === "home" && (
//                         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">

//                             {/* Welcome Banner - Minimal Paper Card */}
//                             <motion.div
//                                 variants={itemVariants}
//                                 className="relative overflow-hidden rounded-xl bg-white p-8 border border-[#E5E5E5] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
//                             >
//                                 {/* Subtle Abstract Pattern */}
//                                 <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
//                                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

//                                 <div className="relative z-10">
//                                     <div className="flex items-center gap-2 text-slate-500 mb-3">
//                                         <Sparkles className="w-4 h-4 text-orange-500" />
//                                         <span className="text-sm font-medium uppercase tracking-wider">Good Morning</span>
//                                     </div>
//                                     <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Hello, {userName}</h1>
//                                     <p className="hidden text-slate-500 max-w-xl text-lg font-light leading-relaxed">
//                                         Ready to learn? You have <span className="text-slate-900 font-medium">3 practicals</span> pending and <span className="text-slate-900 font-medium">2 PYQs</span> to review.
//                                     </p>

//                                     <div className="flex flex-wrap gap-6 mt-8">
//                                         <div className="flex flex-col">
//                                             <p className="text-3xl font-bold text-slate-900">4</p>
//                                             <p className="text-sm text-slate-500 font-medium">Active Subjects</p>
//                                         </div>
//                                         <div className="w-px h-10 bg-slate-200" />
//                                         <div className="flex flex-col">
//                                             <p className="text-3xl font-bold text-slate-900">12</p>
//                                             <p className="text-sm text-slate-500 font-medium">Notes Uploaded</p>
//                                         </div>
//                                         <div className="w-px h-10 bg-slate-200" />
//                                         <div className="flex flex-col">
//                                             <p className="text-3xl font-bold text-slate-900">68%</p>
//                                             <p className="text-sm text-slate-500 font-medium">Progress</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>

//                             {/* Subjects Grid - Bento Style */}
//                             <motion.div variants={itemVariants}>
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-xl font-bold text-slate-900 tracking-tight">Current Subjects</h2>
//                                     <button
//                                         onClick={() => { }} // Placeholder or navigation logic
//                                         className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-1 px-3 py-2 rounded-md transition-colors"
//                                     >
//                                         View All <ArrowUpRight className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                     {subjects.map((subject, index) => (
//                                         <SubjectCard key={index} subject={subject} index={index} />
//                                     ))}
//                                 </div>
//                             </motion.div>

//                             {/* Recent Practicals */}
//                             <motion.div variants={itemVariants}>
//                                 <div className="flex items-center justify-between mb-6">
//                                     <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Practicals</h2>
//                                     <button
//                                         onClick={() => setCurrentView("practicals")}
//                                         className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-1 px-3 py-2 rounded-md transition-colors"
//                                     >
//                                         View All <ArrowUpRight className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                     {practicals.slice(0, 2).map((practical, index) => (
//                                         <PracticalCard key={index} practical={practical} />
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}

//                     {currentView === "notes" && <NotesSection />}
//                     {currentView === "pyqs" && <PYQSection />}
//                     {currentView === "practicals" && (
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//                             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Practicals</h2>
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 {practicals.map((practical, index) => (
//                                     <PracticalCard key={index} practical={practical} />
//                                 ))}
//                             </div>
//                         </motion.div>
//                     )}
//                 </div>
//             </main>

//             <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
//         </div>
//     )
// }
