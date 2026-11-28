import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    Code2,
    X,
    Sparkles,
    ChevronRight,
    AlertCircle,
    Terminal,
    HelpCircle,
    Code,
    PlusCircle,
    Trash,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import {
    fetchCodingPractices,
    addCodingPracticeTrack,
    updateCodingPracticeTrack,
    deleteCodingPracticeTrack,
    addCodingPracticeProblem,
    updateCodingPracticeProblem,
    deleteCodingPracticeProblem,
} from "@/Api/api";

export function ManagePractice() {
    useTitle("Manage Coding Practice - Admin");

    const [tracks, setTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [trackModalOpen, setTrackModalOpen] = useState(false);
    const [isEditingTrack, setIsEditingTrack] = useState(false);
    const [trackId, setTrackId] = useState("");
    const [trackTitle, setTrackTitle] = useState("");
    const [trackDescription, setTrackDescription] = useState("");
    const [trackLanguage, setTrackLanguage] = useState("");
    const [trackLevel, setTrackLevel] = useState("Beginner");

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
                    const updatedSelected = data.find((t) => t._id === selectedTrack._id);
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
                level: trackLevel,
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
        if (!window.confirm("Delete this language track and all its questions?")) return;
        try {
            await deleteCodingPracticeTrack(id);
            loadTracks();
        } catch (err) {
            console.error("Error deleting track:", err);
            alert("Failed to delete track.");
        }
    };

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
        setProblemExamples(
            problem.examples && problem.examples.length > 0
                ? problem.examples
                : [{ input: "", output: "" }]
        );
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
                examples: problemExamples.filter(
                    (ex) => (ex.input || "").trim() !== "" || (ex.output || "").trim() !== ""
                ),
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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-primary" aria-hidden="true" />
                        Manage Coding Practice
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Create language tracks and manage curated practice problems.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenAddTrack}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98] px-5 min-h-[42px] rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Add Language Track
                </button>
            </div>

            {loading && tracks.length === 0 ? (
                <div className="surface-card rounded-2xl flex items-center justify-center h-64">
                    <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
                        <p className="text-muted-foreground text-xs font-semibold">Loading practice tracks...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="p-6 text-center bg-destructive/10 border border-destructive/25 text-destructive rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5" aria-hidden="true" />
                    <span>{error}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Tracks */}
                    <div className="space-y-3 lg:col-span-1">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Programming Languages ({tracks.length})
                        </h3>
                        <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
                            {tracks.map((track) => {
                                const isSelected = selectedTrack && selectedTrack._id === track._id;
                                return (
                                    <div
                                        key={track._id}
                                        onClick={() => setSelectedTrack(track)}
                                        className={`p-4 rounded-2xl cursor-pointer group transition-all border ${
                                            isSelected ? "bg-indigo-500/10 border-primary/50" : "surface-card"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`p-2.5 rounded-xl border shrink-0 ${
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-secondary text-muted-foreground border-border"
                                                    }`}
                                                >
                                                    <Code2 className="w-4 h-4" aria-hidden="true" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-sm text-foreground truncate">
                                                        {track.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                                                            {track.language}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-primary">
                                                            {track.level}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleOpenEditTrack(track, e)}
                                                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary"
                                                    aria-label="Edit Track"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteTrack(track._id, e)}
                                                    className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive"
                                                    aria-label="Delete Track"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2">
                                            {track.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
                                            <span className="font-bold uppercase tracking-wider tabular-nums">
                                                Questions: {track.problemList?.length || 0}
                                            </span>
                                            <ChevronRight
                                                className={`w-3.5 h-3.5 transition-transform ${
                                                    isSelected ? "translate-x-1 text-primary" : ""
                                                }`}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Problems */}
                    <div className="lg:col-span-2 space-y-4">
                        {selectedTrack ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Questions for {selectedTrack.title} ({selectedTrack.problemList?.length || 0})
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleOpenAddProblem}
                                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs min-h-[38px] px-4 rounded-xl transition-all active:scale-[0.98]"
                                    >
                                        <PlusCircle className="w-4 h-4" aria-hidden="true" />
                                        Add Coding Question
                                    </button>
                                </div>

                                <div className="surface-card rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-border bg-secondary/40">
                                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Question
                                                    </th>
                                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Difficulty
                                                    </th>
                                                    <th className="text-center px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Examples
                                                    </th>
                                                    <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedTrack.problemList &&
                                                    selectedTrack.problemList.map((problem) => (
                                                        <tr
                                                            key={problem._id}
                                                            className="border-b border-border hover:bg-secondary/40 transition-colors"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-foreground text-sm">
                                                                    {problem.question}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                                    {problem.problemDiscription}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                                                        problem.difficulty === "easy"
                                                                            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                                                                            : problem.difficulty === "medium"
                                                                            ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
                                                                            : "bg-rose-500/12 text-rose-700 dark:text-rose-300"
                                                                    }`}
                                                                >
                                                                    {problem.difficulty}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center text-xs text-foreground font-bold tabular-nums">
                                                                {problem.examples?.length || 0}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary transition-colors"
                                                                        onClick={() => handleOpenEditProblem(problem)}
                                                                        aria-label="Edit Question"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-destructive transition-colors"
                                                                        onClick={() => handleDeleteProblem(problem._id)}
                                                                        aria-label="Delete Question"
                                                                    >
                                                                        <Trash className="w-3.5 h-3.5" aria-hidden="true" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                {(!selectedTrack.problemList ||
                                                    selectedTrack.problemList.length === 0) && (
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            className="px-6 py-12 text-center text-muted-foreground text-xs font-semibold"
                                                        >
                                                            No coding questions in this track yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="surface-card rounded-2xl border-dashed flex flex-col items-center justify-center h-80 text-center p-8">
                                <HelpCircle className="w-10 h-10 text-muted-foreground mb-3" aria-hidden="true" />
                                <p className="text-foreground font-bold text-sm">
                                    No Programming Language Selected
                                </p>
                                <p className="text-muted-foreground text-xs mt-1.5 max-w-xs leading-relaxed">
                                    Select a track on the left or create a new one to manage coding questions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Track Modal */}
            <AnimatePresence>
                {trackModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTrackModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="surface-card rounded-3xl w-full max-w-md p-6 z-10 relative"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                                    {isEditingTrack ? "Edit Language Track" : "Add Language Track"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setTrackModalOpen(false)}
                                    aria-label="Close modal"
                                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTrack} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground">Track Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Python Basics"
                                        value={trackTitle}
                                        onChange={(e) => setTrackTitle(e.target.value)}
                                        className="w-full px-3.5 min-h-[42px] rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-foreground">Language Key</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. python"
                                            value={trackLanguage}
                                            onChange={(e) => setTrackLanguage(e.target.value)}
                                            className="w-full px-3.5 min-h-[42px] rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-foreground">Level</label>
                                        <select
                                            value={trackLevel}
                                            onChange={(e) => setTrackLevel(e.target.value)}
                                            className="w-full px-3.5 min-h-[42px] rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Describe what students will learn..."
                                        value={trackDescription}
                                        onChange={(e) => setTrackDescription(e.target.value)}
                                        className="w-full p-3.5 rounded-xl bg-background border border-input text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setTrackModalOpen(false)}
                                        className="px-4 min-h-[40px] rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 min-h-[40px] rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
                                    >
                                        Save Track
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Problem Modal */}
            <AnimatePresence>
                {problemModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setProblemModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="surface-card rounded-3xl w-full max-w-lg p-6 z-10 relative my-8"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                                    <Code className="w-5 h-5 text-primary" aria-hidden="true" />
                                    {isEditingProblem ? "Edit Coding Question" : "Add Coding Question"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setProblemModalOpen(false)}
                                    aria-label="Close modal"
                                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProblem} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground">Question Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Reverse a String"
                                        value={problemQuestion}
                                        onChange={(e) => setProblemQuestion(e.target.value)}
                                        className="w-full px-3.5 min-h-[42px] rounded-xl bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground">Difficulty</label>
                                    <div className="flex gap-2.5">
                                        {["easy", "medium", "hard"].map((difficulty) => (
                                            <label
                                                key={difficulty}
                                                className={`flex-1 flex items-center justify-center min-h-[40px] px-4 rounded-xl text-xs font-bold cursor-pointer capitalize border transition-colors ${
                                                    problemDifficulty === difficulty
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background text-muted-foreground border-border hover:text-foreground"
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
                                    <label className="text-xs font-bold text-foreground">Problem Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Write problem description, constraints, and logic..."
                                        value={problemDescription}
                                        onChange={(e) => setProblemDescription(e.target.value)}
                                        className="w-full p-3.5 rounded-xl bg-background border border-input text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-foreground">
                                            Test Cases / Examples
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddExampleField}
                                            className="text-xs text-primary font-bold flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Example
                                        </button>
                                    </div>

                                    <div className="space-y-2.5">
                                        {problemExamples.map((example, index) => (
                                            <div key={index} className="flex gap-2.5 items-end rounded-xl p-3 bg-secondary/40 border border-border">
                                                <div className="flex-1 grid grid-cols-2 gap-2.5">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                            Input {index + 1}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            placeholder='e.g. "hello"'
                                                            value={example.input}
                                                            onChange={(e) =>
                                                                handleExampleChange(index, "input", e.target.value)
                                                            }
                                                            className="w-full px-3 min-h-[36px] rounded-lg bg-background border border-input text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                            Output {index + 1}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            placeholder='e.g. "olleh"'
                                                            value={example.output}
                                                            onChange={(e) =>
                                                                handleExampleChange(index, "output", e.target.value)
                                                            }
                                                            className="w-full px-3 min-h-[36px] rounded-lg bg-background border border-input text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={problemExamples.length === 1}
                                                    onClick={() => handleRemoveExampleField(index)}
                                                    aria-label="Remove example"
                                                    className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive disabled:opacity-30"
                                                >
                                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2.5 pt-4 border-t border-border sticky bottom-0 bg-card py-2">
                                    <button
                                        type="button"
                                        onClick={() => setProblemModalOpen(false)}
                                        className="px-4 min-h-[40px] rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 min-h-[40px] rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
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
