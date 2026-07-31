import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, Code2, Layers, X, Sparkles, ChevronRight, AlertCircle, Terminal, HelpCircle, Code, PlusCircle, Trash } from "lucide-react"
import { useTitle } from "@/hooks/useTitle"
import {
    fetchCodingPractices,
    addCodingPracticeTrack,
    updateCodingPracticeTrack,
    deleteCodingPracticeTrack,
    addCodingPracticeProblem,
    updateCodingPracticeProblem,
    deleteCodingPracticeProblem
} from "@/Api/api"

export function ManagePractice() {
    useTitle("Manage Coding Practice - Admin");

    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track Form State
    const [trackModalOpen, setTrackModalOpen] = useState(false);
    const [isEditingTrack, setIsEditingTrack] = useState(false);
    const [trackId, setTrackId] = useState("");
    const [trackTitle, setTrackTitle] = useState("");
    const [trackDescription, setTrackDescription] = useState("");
    const [trackLanguage, setTrackLanguage] = useState("");
    const [trackLevel, setTrackLevel] = useState("Beginner");

    // Problem Form State
    const [problemModalOpen, setProblemModalOpen] = useState(false);
    const [isEditingProblem, setIsEditingProblem] = useState(false);
    const [problemId, setProblemId] = useState("");
    const [problemQuestion, setProblemQuestion] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [problemDifficulty, setProblemDifficulty] = useState("easy");
    const [problemExamples, setProblemExamples] = useState([{ input: "", output: "" }]);

    const loadTracks = async () => {
        try {
            setLoading(true);
            const res = await fetchCodingPractices();
            const data = Array.isArray(res?.data.data) ? res.data.data : [];
            setTracks(data);
            if (data.length > 0) {
                if (selectedTrack) {
                    const updatedSelected = data.find(t => t._id === selectedTrack._id);
                    setSelectedTrack(updatedSelected || data[0]);
                } else {
                    setSelectedTrack(data[0]);
                }
            } else {
                setSelectedTrack(null);
            }
        } catch (err) {
            console.error("Error loading tracks:", err);
            setError("Failed to load coding practice tracks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTracks();
    }, []);

    // Track Operations
    const handleOpenAddTrack = () => {
        setIsEditingTrack(false);
        setTrackId("");
        setTrackTitle("");
        setTrackDescription("");
        setTrackLanguage("");
        setTrackLevel("Beginner");
        setTrackModalOpen(true);
    };

    const handleOpenEditTrack = (track, e) => {
        e.stopPropagation();
        setIsEditingTrack(true);
        setTrackId(track._id);
        setTrackTitle(track.title);
        setTrackDescription(track.description);
        setTrackLanguage(track.language);
        setTrackLevel(track.level);
        setTrackModalOpen(true);
    };

    const handleSaveTrack = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: trackTitle,
                description: trackDescription,
                language: trackLanguage,
                level: trackLevel
            };

            if (isEditingTrack) {
                await updateCodingPracticeTrack(trackId, data);
            } else {
                await addCodingPracticeTrack(data);
            }
            setTrackModalOpen(false);
            loadTracks();
        } catch (err) {
            console.error("Error saving track:", err);
            alert("Failed to save track.");
        }
    };

    const handleDeleteTrack = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this programming language track? This will delete all its questions!")) return;
        try {
            await deleteCodingPracticeTrack(id);
            loadTracks();
        } catch (err) {
            console.error("Error deleting track:", err);
            alert("Failed to delete track.");
        }
    };

    // Problem Operations
    const handleOpenAddProblem = () => {
        setIsEditingProblem(false);
        setProblemId("");
        setProblemQuestion("");
        setProblemDescription("");
        setProblemDifficulty("easy");
        setProblemExamples([{ input: "", output: "" }]);
        setProblemModalOpen(true);
    };

    const handleOpenEditProblem = (problem) => {
        setIsEditingProblem(true);
        setProblemId(problem._id);
        setProblemQuestion(problem.question);
        setProblemDescription(problem.problemDiscription || "");
        setProblemDifficulty(problem.difficulty || "easy");
        setProblemExamples(problem.examples && problem.examples.length > 0 ? problem.examples : [{ input: "", output: "" }]);
        setProblemModalOpen(true);
    };

    const handleExampleChange = (index, field, value) => {
        const updated = [...problemExamples];
        updated[index][field] = value;
        setProblemExamples(updated);
    };

    const handleAddExampleField = () => {
        setProblemExamples([...problemExamples, { input: "", output: "" }]);
    };

    const handleRemoveExampleField = (index) => {
        if (problemExamples.length === 1) return;
        setProblemExamples(problemExamples.filter((_, i) => i !== index));
    };

    const handleSaveProblem = async (e) => {
        e.preventDefault();
        if (!selectedTrack) return;
        try {
            const data = {
                trackId: selectedTrack._id,
                question: problemQuestion,
                problemDiscription: problemDescription,
                difficulty: problemDifficulty,
                examples: problemExamples.filter(ex => (ex.input || "").trim() !== "" || (ex.output || "").trim() !== "")
            };

            if (isEditingProblem) {
                await updateCodingPracticeProblem(selectedTrack._id, problemId, data);
            } else {
                await addCodingPracticeProblem(data);
            }
            setProblemModalOpen(false);
            loadTracks();
        } catch (err) {
            console.error("Error saving problem:", err);
            alert("Failed to save problem.");
        }
    };

    const handleDeleteProblem = async (pId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await deleteCodingPracticeProblem(selectedTrack._id, pId);
            loadTracks();
        } catch (err) {
            console.error("Error deleting problem:", err);
            alert("Failed to delete problem.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-indigo-600" />
                        Manage Coding Practice
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Create programming language tracks and add coding practice questions for students.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddTrack}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-[10px] px-5 py-2.5 shadow-md shadow-indigo-600/10 transition-all active:scale-[0.98] text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Programming Language
                </button>
            </motion.div>

            {loading && tracks.length === 0 ? (
                <div className="flex items-center justify-center h-64 border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[10px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading practice tracks...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="p-6 text-center border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 rounded-[10px] flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Language Tracks */}
                    <div className="space-y-4 lg:col-span-1">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Programming Languages ({tracks.length})
                        </h3>
                        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                            {tracks.map((track) => {
                                const isSelected = selectedTrack && selectedTrack._id === track._id;
                                return (
                                    <motion.div
                                        key={track._id}
                                        onClick={() => setSelectedTrack(track)}
                                        className={`p-4 rounded-[10px] border transition-all cursor-pointer relative group ${
                                            isSelected
                                                ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10 shadow-sm"
                                                : "border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                                        }`}
                                        whileHover={{ y: -1 }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                    <Code2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-950 dark:text-white text-sm">
                                                        {track.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                            {track.language}
                                                        </span>
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                                            {track.level}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => handleOpenEditTrack(track, e)}
                                                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                                                    title="Edit Track"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteTrack(track._id, e)}
                                                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500"
                                                    title="Delete Track"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                            {track.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                                            <span>Questions: {track.problemList?.length || 0}</span>
                                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-indigo-500' : ''}`} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {tracks.length === 0 && (
                                <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-[10px] text-slate-400 text-xs">
                                    No language tracks added yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Problems management */}
                    <div className="lg:col-span-2 space-y-4">
                        {selectedTrack ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        Practice Questions for {selectedTrack.title} ({selectedTrack.problemList?.length || 0})
                                    </h3>
                                    <button
                                        onClick={handleOpenAddProblem}
                                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs py-1 px-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Coding Question
                                    </button>
                                </div>

                                <div className="border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[10px] overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Question</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Difficulty</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono text-center">Examples</th>
                                                    <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {selectedTrack.problemList && selectedTrack.problemList.map((problem, idx) => (
                                                    <tr key={problem._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                                                {problem.question}
                                                            </div>
                                                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                                {problem.problemDiscription}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                problem.difficulty === 'easy'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400'
                                                                    : problem.difficulty === 'medium'
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'
                                                            }`}>
                                                                {problem.difficulty}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                            {problem.examples?.length || 0}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end gap-1.5">
                                                                <button
                                                                    className="flex items-center justify-center w-8 h-8 rounded-[10px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
                                                                    onClick={() => handleOpenEditProblem(problem)}
                                                                    title="Edit Question"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="flex items-center justify-center w-8 h-8 rounded-[10px] text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                                    onClick={() => handleDeleteProblem(problem._id)}
                                                                    title="Delete Question"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {(!selectedTrack.problemList || selectedTrack.problemList.length === 0) && (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm">
                                                            No coding questions in this track yet. Click "Add Coding Question" to create one.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 dark:border-slate-800 rounded-[10px] text-center p-8 bg-white dark:bg-slate-900">
                                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No Programming Language Selected</p>
                                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                                    Select a programming language track from the left panel, or create a new one to start managing coding questions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit Track */}
            <AnimatePresence>
                {trackModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTrackModalOpen(false)}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />

                        {/* Modal Body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 border border-[#E5E5E5] dark:border-slate-800 rounded-[12px] shadow-2xl w-full max-w-md p-6 z-10 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                    {isEditingTrack ? "Edit Language Track" : "Add Programming Language"}
                                </h3>
                                <button
                                    onClick={() => setTrackModalOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTrack} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Track Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Python Basics"
                                        value={trackTitle}
                                        onChange={(e) => setTrackTitle(e.target.value)}
                                        className="w-full px-3.5 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Language Key</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. python, javascript"
                                            value={trackLanguage}
                                            onChange={(e) => setTrackLanguage(e.target.value)}
                                            className="w-full px-3.5 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Difficulty Level</label>
                                        <select
                                            value={trackLevel}
                                            onChange={(e) => setTrackLevel(e.target.value)}
                                            className="w-full px-3.5 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white cursor-pointer"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Track Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Briefly describe what students will learn in this track..."
                                        value={trackDescription}
                                        onChange={(e) => setTrackDescription(e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setTrackModalOpen(false)}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-[10px] text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-[10px] text-sm shadow-md shadow-indigo-600/10 transition-colors"
                                    >
                                        Save Track
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal for Add/Edit Problem */}
            <AnimatePresence>
                {problemModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProblemModalOpen(false)}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />

                        {/* Modal Body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 border border-[#E5E5E5] dark:border-slate-800 rounded-[12px] shadow-2xl w-full max-w-lg p-6 z-10 relative overflow-hidden my-8"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Code className="w-5 h-5 text-indigo-500" />
                                    {isEditingProblem ? "Edit Coding Question" : "Add Coding Question"}
                                </h3>
                                <button
                                    onClick={() => setProblemModalOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProblem} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Question Name / Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Reverse a String"
                                        value={problemQuestion}
                                        onChange={(e) => setProblemQuestion(e.target.value)}
                                        className="w-full px-3.5 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Difficulty</label>
                                    <div className="flex gap-4">
                                        {["easy", "medium", "hard"].map((difficulty) => (
                                            <label
                                                key={difficulty}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold border cursor-pointer capitalize transition-all select-none ${
                                                    problemDifficulty === difficulty
                                                        ? difficulty === 'easy'
                                                            ? 'border-green-500 bg-green-50/50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                                            : difficulty === 'medium'
                                                            ? 'border-yellow-500 bg-yellow-50/50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'
                                                            : 'border-red-500 bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="difficulty"
                                                    value={difficulty}
                                                    checked={problemDifficulty === difficulty}
                                                    onChange={(e) => setProblemDifficulty(e.target.value)}
                                                    className="sr-only"
                                                />
                                                {difficulty}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Problem Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Write a clear and detailed description of the problem, constraints, and expected logic..."
                                        value={problemDescription}
                                        onChange={(e) => setProblemDescription(e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-[10px] text-sm transition-all text-slate-950 dark:text-white resize-none font-sans"
                                    />
                                </div>

                                {/* Examples Section */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <span>Test Cases / Examples</span>
                                            <span className="text-[10px] font-normal text-slate-400 lowercase">(at least one recommended)</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddExampleField}
                                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Example
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {problemExamples.map((example, index) => (
                                            <div key={index} className="flex gap-3 items-end bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 relative group">
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Input {index + 1}</span>
                                                        <input
                                                            type="text"
                                                            placeholder='e.g. "hello"'
                                                            value={example.input}
                                                            onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                                                            className="w-full px-3 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs text-slate-950 dark:text-white"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Output {index + 1}</span>
                                                        <input
                                                            type="text"
                                                            placeholder='e.g. "olleh"'
                                                            value={example.output}
                                                            onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                                                            className="w-full px-3 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs text-slate-950 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={problemExamples.length === 1}
                                                    onClick={() => handleRemoveExampleField(index)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 sticky bottom-0 bg-white dark:bg-slate-900 py-1">
                                    <button
                                        type="button"
                                        onClick={() => setProblemModalOpen(false)}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-[10px] text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-[10px] text-sm shadow-md shadow-indigo-600/10 transition-colors"
                                    >
                                        Save Question
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
