import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Search,
    FileText,
    FlaskConical,
    X,
    ChevronDown,
    Copy,
    Check,
} from "lucide-react";
import { Progress } from "/components/ui/progress";
import { Badge } from "/components/ui/badge";
import { useData } from "@/context/DataContext";
import { customMessage } from "@/Utils/customMessage";
import { copyToClipboard } from "@/Utils/clipboard";

export function ContextSidebar({
    currentTokenCount,
    tokenPercentage,
    systemPrompt,
    setSystemPrompt,
    systemPromptOptions,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    attachedNotes,
    attachedPracticals,
    handleToggleNote,
    handleTogglePractical,
    updateActiveChatConfig,
    isRightPanelOpen,
}) {
    const { notes, practicals } = useData();

    // Local search states
    const [noteSearch, setNoteSearch] = useState("");
    const [practicalSearch, setPracticalSearch] = useState("");
    const [questionSearch, setQuestionSearch] = useState("");

    // Modal states
    const [isQuestionModal, setIsQuestionModel] = useState(false);
    const [practicalsQuestion, setPracticalsQuestion] = useState([]);
    const [section, setSection] = useState(null);

    // Custom Accordion & Clipboard feedback states
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [copiedText, setCopiedText] = useState("");

    const handleCopyQuestion = async (text) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedText(text);
            customMessage({ type: "success", content: "Question copied to clipboard!" });
            setTimeout(() => setCopiedText(""), 2000);
        }
    };

    const filteredQuestionsData = useMemo(() => {
        if (!questionSearch.trim()) return practicalsQuestion;

        return practicalsQuestion.map(prac => {
            const matches = (prac.questions || []).filter(q =>
                (q.question || "").toLowerCase().includes(questionSearch.toLowerCase())
            );
            return { ...prac, questions: matches };
        }).filter(prac => (prac.questions || []).length > 0);
    }, [practicalsQuestion, questionSearch]);

    // Filter notes and practicals
    const filteredNotes = useMemo(() => {
        return notes.filter((n) =>
            (n.title || "").toLowerCase().includes(noteSearch.toLowerCase()) ||
            (n.section || "").toLowerCase().includes(noteSearch.toLowerCase())
        );
    }, [notes, noteSearch]);

    const filteredPracticals = useMemo(() => {
        const practicalSections = practicals.map((i) => i.section);
        const uniqueSections = [...new Set(practicalSections)];
        return uniqueSections.filter((sec) =>
            (sec || "").toLowerCase().includes(practicalSearch.toLowerCase())
        );
    }, [practicals, practicalSearch]);

    // Practicals Questions
    const getPracticalQuestions = (sectionName) => {
        setPracticalsQuestion(practicals.filter((p) => p.section === sectionName));
        setSection(sectionName);
    };

    const items = practicalsQuestion.map((practical) => ({
        key: `practical-${practical.practicalNumber}`,
        label: `Practical : ${practical.practicalNumber}`,
        icon: <FlaskConical className="w-3.5 h-3.5 mr-1" />,
        children: (practical.questions || []).map((question) => ({
            key: JSON.stringify({
                question: question.question,
            }),
            label: question.question,
        })),
    }));

    return (
        <div>
            <AnimatePresence>
                {isRightPanelOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "320px", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex flex-col h-full bg-white border-l border-slate-200 text-slate-900 shrink-0 md:relative fixed right-0 top-0 z-10 shadow-2xl md:shadow-none"
                    >
                        {/* Token Indicator Header */}
                        <div className="p-5 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsRightPanelOpen(false)}
                                        className="md:hidden p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer mr-1"
                                        title="Close Panel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-indigo-600" />
                                        <span>Context Window</span>
                                    </h3>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="bg-indigo-50 text-indigo-600 text-[10px] font-mono border-indigo-100 px-1 py-0.5"
                                >
                                    {currentTokenCount.toLocaleString()} / 32k
                                </Badge>
                            </div>

                            <div className="space-y-1.5">
                                <Progress
                                    value={tokenPercentage}
                                    className="h-2 rounded bg-slate-100 [&>div]:bg-indigo-600"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>{tokenPercentage}% Capacity Used</span>
                                    <span>
                                        {32768 - currentTokenCount > 0
                                            ? `${(32768 - currentTokenCount).toLocaleString()} available`
                                            : "Full"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Scrolling Configuration */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6" data-lenis-prevent>
                            {/* System prompt personas */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    System Persona
                                </h4>
                                <select
                                    value={systemPrompt}
                                    onChange={(e) => {
                                        setSystemPrompt(e.target.value);
                                        updateActiveChatConfig("systemPrompt", e.target.value);
                                    }}
                                    className="w-full bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 font-semibold cursor-pointer"
                                >
                                    {Object.keys(systemPromptOptions).map((key) => (
                                        <option key={key} value={key}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Slider Settings */}
                            <div className="space-y-4 border-t border-slate-200 pt-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Model Parameters
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Temperature</span>
                                        <span className="font-bold text-indigo-600">{temperature}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.0"
                                        max="1.0"
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            setTemperature(v);
                                            updateActiveChatConfig("temperature", v);
                                        }}
                                        className="w-full accent-indigo-500 bg-slate-100 rounded h-1 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Max Tokens</span>
                                        <span className="font-bold text-indigo-600">{maxTokens}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="256"
                                        max="4096"
                                        step="128"
                                        value={maxTokens}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setMaxTokens(v);
                                            updateActiveChatConfig("maxTokens", v);
                                        }}
                                        className="w-full accent-lime-500 bg-slate-100 rounded h-1 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Notes selection list */}
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Attach Notes
                                    </h4>
                                    <Badge className="bg-indigo-600 text-white text-[10px] font-bold font-sans">
                                        {attachedNotes.length} attached
                                    </Badge>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search Notes..."
                                        value={noteSearch}
                                        onChange={(e) => setNoteSearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                </div>
                                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1" data-lenis-prevent>
                                    {filteredNotes.map((note) => {
                                        const isChecked = attachedNotes.includes(note._id);
                                        return (
                                            <div
                                                key={note._id}
                                                onClick={() => handleToggleNote(note._id)}
                                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors border ${isChecked
                                                        ? "bg-indigo-50 border-indigo-100 text-indigo-900 font-semibold"
                                                        : "bg-slate-50 border-transparent hover:bg-slate-200 text-slate-450"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="truncate">{note.title}</span>
                                                </div>
                                                <span className="text-[10px] px-1 text-slate-400 shrink-0">
                                                    {note.section}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {filteredNotes.length === 0 && (
                                        <div className="text-slate-400 text-xs py-2 text-center">
                                            No matching notes found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Practicals selection list */}
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Attach Practicals
                                    </h4>
                                    <Badge className="bg-indigo-600 text-white text-[10px] font-bold font-sans">
                                        {attachedPracticals.length} attached
                                    </Badge>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search Practicals..."
                                        value={practicalSearch}
                                        onChange={(e) => setPracticalSearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-300 text-slate-700"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                                </div>
                                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1" data-lenis-prevent>
                                    {filteredPracticals.map((prac, index) => {
                                        const isChecked = attachedPracticals.includes(index);
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    handleTogglePractical(index);
                                                    getPracticalQuestions(prac);
                                                    setIsQuestionModel(true);
                                                }}
                                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors border ${isChecked
                                                        ? "bg-indigo-50 border-indigo-100 text-indigo-900 font-semibold"
                                                        : "bg-slate-50 border-transparent hover:bg-slate-200 text-slate-450"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FlaskConical className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="truncate">{prac || "Untitled Practical"}</span>
                                                </div>
                                                <span className="text-[10px] px-1 text-slate-400 shrink-0">
                                                    Practicals
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {filteredPracticals.length === 0 && (
                                        <div className="text-slate-400 text-xs py-2 text-center">
                                            No matching practicals found.
                                        </div>
                                    )}
                                </div>

                                {isQuestionModal && (
                                    <div className="fixed inset-0 bg-slate-955/65 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl border border-slate-150 overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Modal Header */}
                                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <FlaskConical className="w-5 h-5 text-indigo-600 shrink-0" />
                                                    <div className="min-w-0 font-sans">
                                                        <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">
                                                            {section || "Lab Questions"}
                                                        </h3>
                                                        <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 truncate font-medium">
                                                            Select or copy a question to ask the AI assistant
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsQuestionModel(false)}
                                                    className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Modal Search Bar */}
                                            <div className="p-4 border-b border-slate-100 bg-white">
                                                <div className="relative font-sans">
                                                    <input
                                                        type="text"
                                                        placeholder="Search questions inside this lab..."
                                                        value={questionSearch}
                                                        onChange={(e) => setQuestionSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-medium"
                                                    />
                                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                                </div>
                                            </div>

                                            {/* Modal Body / Accordion List */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 font-sans" data-lenis-prevent="true">
                                                {filteredQuestionsData.map((prac) => {
                                                    const key = `prac-${prac.practicalNumber}`;
                                                    const isOpen = activeAccordion === key;
                                                    return (
                                                        <div key={key} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-sm">
                                                            <button
                                                                onClick={() => setActiveAccordion(isOpen ? null : key)}
                                                                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-xs text-slate-800 hover:bg-slate-50/50 transition-colors cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                                                                    <span>Practical {prac.practicalNumber}</span>
                                                                </div>
                                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                                            </button>

                                                            {isOpen && (
                                                                <div className="border-t border-slate-100 bg-white p-3 space-y-2">
                                                                    {(prac.questions || []).map((q, qidx) => {
                                                                        const isCopied = copiedText === q.question;
                                                                        return (
                                                                            <div
                                                                                key={qidx}
                                                                                className="group p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-150 hover:border-indigo-500/20 rounded-lg flex items-start justify-between gap-3 transition-all"
                                                                            >
                                                                                <p className="text-xs text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors font-semibold">
                                                                                    {q.question}
                                                                                </p>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleCopyQuestion(q.question)
                                                                                        console.log("Copy button clicked for question:", q._id)
                                                                                        handleTogglePractical(q._id); // Adjust index if necessary
                                                                                    }}
                                                                                    className="shrink-0 p-1.5 rounded-md border border-slate-200 hover:border-indigo-500/30 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                                                                    title="Copy Question"

                                                                                >
                                                                                    {isCopied ? <Check size={13} className="text-indigo-650" /> : <Copy size={13} />}
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {filteredQuestionsData.length === 0 && (
                                                    <div className="text-slate-400 text-xs py-8 text-center bg-white rounded-xl border border-slate-150 shadow-sm font-semibold">
                                                        No matching questions found.
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
