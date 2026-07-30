import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCodingPractices } from "@/Api/api";
import { theme } from "@/lib/theme";
import { 
    ArrowLeft, 
    AlertCircle, 
    Code2, 
    Play, 
    Send, 
    Sparkles, 
    SquareCode, 
    Terminal, 
    RotateCcw, 
    Copy, 
    Check 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { DashboardLayout } from "@/components/layout/layout";
import { updateProblemStatus } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { codeChecker } from "@/Api/api";

const DEFAULT_TEMPLATES = {
    javascript: `// Write your JavaScript solution here
function solve() {
    console.log("Hello World");
}

solve();`,
    python: `# Write your Python solution here
def solve():
    print("Hello World")

solve()`,
    cpp: `// Write your C++ solution here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
    java: `// Write your Java solution here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
    c: `// Write your C solution here
#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`
};

function Badge({ children, variant = "neutral" }) {
    const variants = {
        neutral: {
            background: theme.colors.softGray,
            borderColor: theme.colors.lightGray,
            color: theme.colors.dark,
        },
        primary: {
            background: theme.colors.limeDim,
            borderColor: theme.colors.limeMedium,
            color: theme.colors.dark,
        },
        info: {
            background: "rgba(59,130,246,0.10)",
            borderColor: "rgba(59,130,246,0.22)",
            color: "#2563EB",
        },
        success: {
            background: "rgba(34,197,94,0.10)",
            borderColor: "rgba(34,197,94,0.22)",
            color: "#16A34A",
        },
        warning: {
            background: "rgba(245,158,11,0.10)",
            borderColor: "rgba(245,158,11,0.22)",
            color: "#D97706",
        },
        danger: {
            background: "rgba(239,68,68,0.10)",
            borderColor: "rgba(239,68,68,0.22)",
            color: "#DC2626",
        },
    };

    const style = variants[variant] || variants.neutral;

    return (
        <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all"
            style={style}
        >
            {children}
        </span>
    );
}

function ExampleCard({ index, example }) {
    const [copiedInput, setCopiedInput] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);

    const handleCopy = (text, setCopied) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 shadow-sm transition-all hover:shadow-md">
            <div className="h-10 bg-zinc-100/80 px-4 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 flex items-center gap-1.5 select-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Example {index + 1}
                </span>
            </div>
            <div className="p-4 space-y-4 font-mono text-xs">
                <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider select-none">
                        <span>Input</span>
                        <button
                            onClick={() => handleCopy(example.input, setCopiedInput)}
                            className="text-[10px] text-zinc-500 hover:text-zinc-800 transition flex items-center gap-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 font-sans"
                        >
                            {copiedInput ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedInput ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <pre className="bg-zinc-950 text-zinc-100 p-3 rounded-xl overflow-x-auto shadow-inner leading-relaxed select-text">
                        {example.input}
                    </pre>
                </div>
                <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider select-none">
                        <span>Output</span>
                        <button
                            onClick={() => handleCopy(example.output, setCopiedOutput)}
                            className="text-[10px] text-zinc-500 hover:text-zinc-800 transition flex items-center gap-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 font-sans"
                        >
                            {copiedOutput ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedOutput ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <pre className="bg-zinc-950 text-emerald-400 p-3 rounded-xl overflow-x-auto shadow-inner leading-relaxed select-text">
                        {example.output}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default function CodeEditor() {
    const { problemId, language } = useParams();
    const navigate = useNavigate();

    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [fetching, setFetching] = useState(true);
    const [submitLaoding, setSubmitLaoding] = useState(false);
    
    // Editor controls state
    const [fontSize, setFontSize] = useState(15);
    const [wordWrap, setWordWrap] = useState("on");
    const [activeTab, setActiveTab] = useState("description"); // "description" | "editor" | "console"
    const [editorSize, setEditorSize] = useState("small"); // "small" | "big"

    const [code, setCode] = useState(`function solve() {\n  console.log("Hello World");\n}`);

    // Load default templates when language changes
    useEffect(() => {
        const langKey = String(language || "").toLowerCase();
        if (DEFAULT_TEMPLATES[langKey]) {
            setCode(DEFAULT_TEMPLATES[langKey]);
        } else {
            setCode(`function solve() {\n  console.log("Hello World");\n}`);
        }
    }, [language]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setFetching(true);
            try {
                const res = await fetchCodingPractices();
                const list = Array.isArray(res?.data.data) ? res.data.data : [];
                const currentLanguage = String(language || "").toLowerCase();

                const filterLanguage = list.find(
                    (item) => String(item?.language || "").toLowerCase() === currentLanguage
                );

                const filterProblem = filterLanguage?.problemList?.find(
                    (problem) => String(problem?._id) === String(problemId)
                );

                if (mounted) setData(filterProblem || {});
            } catch (error) {
                console.error("Error fetching coding practices:", error);
                if (mounted) setData({});
            } finally {
                if (mounted) setFetching(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [language, problemId]);

    const examples = useMemo(() => data?.examples || [], [data]);

    const getLanguageId = async (languageName) => {
        const { data } = await axios.get("https://ce.judge0.com/languages");

        const matchedLang = data.find((lang) =>
            lang.name.toLowerCase().includes(languageName.toLowerCase())
        );

        return matchedLang ? matchedLang.id : null;
    };

    const runCode = async () => {
        try {
            setLoading(true);
            setOutput("Running...");
            
            // Auto switch to console tab on mobile devices
            if (window.innerWidth < 1024) {
                setActiveTab("console");
            }

            const languageId = await getLanguageId(language);
            const response = await axios.post(
                "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
                {
                    source_code: code,
                    language_id: languageId,
                    stdin: "",
                }
            );

            setOutput(response.data.stdout || response.data.stderr || "No output");
        } catch (error) {
            setOutput("Error running code. Please check your internet connection.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitLaoding(true);
            await runCode();
            
            const question = data?.question || "hello";
            const outputVal = data?.examples?.[0]?.output || "";

            // Check user submitted code 
            const check = await codeChecker({ question, code, output: outputVal });
            
            if (!check.data || check.data.message === undefined) {
                customMessage({
                    type: "error",
                    content: "Failed to evaluate code. Check connection!"
                });
                return;
            }

            if (check.data.data === "true") {
                const day = new Date().toLocaleString('en-US', { weekday: 'long' });
                const updateStatus = await updateProblemStatus({ problemId, language, day });
                
                if (updateStatus.data.success === true) {
                    customMessage({
                        type: "success",
                        content: `Excellent! Your code submitted successfully.`
                    });
                    
                    setTimeout(() => {
                        goBack();
                    }, 1500);
                } else {
                    customMessage({
                        type: "success",
                        content: `Code evaluated correctly! Status updated.`
                    });
                }
            } else {
                customMessage({
                    type: "error",
                    content: `Incorrect solution. Verify example test cases!`
                });
            }
        } catch (err) {
            console.error(err);
            customMessage({
                type: "error",
                content: `Error submitting solution.`
            });
        } finally {
            setSubmitLaoding(false);
        }
    };

    const resetTemplate = () => {
        const langKey = String(language || "").toLowerCase();
        if (DEFAULT_TEMPLATES[langKey]) {
            setCode(DEFAULT_TEMPLATES[langKey]);
        } else {
            setCode(`function solve() {\n  console.log("Hello World");\n}`);
        }
        customMessage({
            type: "success",
            content: "Workspace code reset to default template."
        });
    };

    const goBack = () => {
        navigate(`/dashboard/coding-practice/${encodeURIComponent(String(language || "").toLowerCase())}`);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-6">
                
                {/* Sleek Breadcrumb Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={goBack}
                            className="inline-flex items-center justify-center p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-all shadow-sm active:scale-95 shrink-0"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-700" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider select-none">
                                <span>Practice</span>
                                <span>/</span>
                                <span className="text-zinc-700">{String(language || "").toUpperCase()}</span>
                                <span>/</span>
                                <span className="text-zinc-400 font-medium">Workspace</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 truncate mt-0.5">
                                {data?.question || "Solve the problem"}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 self-end md:self-center select-none">
                        <Badge variant="primary">
                            <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
                            Live Coding
                        </Badge>
                        {data?.difficulty && (
                            <Badge variant={
                                data.difficulty.toLowerCase() === "easy" ? "success" :
                                data.difficulty.toLowerCase() === "medium" ? "warning" :
                                data.difficulty.toLowerCase() === "hard" ? "danger" : "neutral"
                            }>
                                {data.difficulty}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Tabs */}
                <div className="flex lg:hidden items-center border border-zinc-200 bg-white p-1 rounded-xl gap-1 select-none">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === "description"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab("editor")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === "editor"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab("console")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative ${
                            activeTab === "console"
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                    >
                        Console Output
                        {output && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                        )}
                    </button>
                </div>

                {/* Main Workspace panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Description & Metadata */}
                    <div className={`lg:col-span-5 flex flex-col ${editorSize === "big" ? "lg:hidden" : ""} ${activeTab === "description" ? "block" : "hidden lg:block"}`}>
                        <Card
                            className="rounded-2xl border flex flex-col h-full"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                                boxShadow: "0 4px 12px rgba(17,17,19,0.03)",
                            }}
                        >
                            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between select-none">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-indigo-500" />
                                    <CardTitle className="text-base font-bold text-zinc-900">Problem Description</CardTitle>
                                </div>
                                <div className="text-xs font-semibold text-zinc-400">
                                    {examples.length} Example{examples.length === 1 ? "" : "s"}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 flex-1 flex flex-col overflow-y-auto max-h-[720px] custom-scrollbar">
                                {fetching ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="font-semibold text-sm">Loading problem details...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-800 mb-2">
                                                {data?.question || "No problem found"}
                                            </h3>
                                            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                                                {data?.problemDiscription || "No description available."}
                                            </p>
                                        </div>

                                        {/* Examples */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-zinc-700 flex items-center gap-2 select-none">
                                                <Code2 className="w-4 h-4 text-zinc-500" />
                                                Examples
                                            </h4>
                                            {examples.length ? (
                                                examples.map((example, index) => (
                                                    <ExampleCard key={index} index={index} example={example} />
                                                ))
                                            ) : (
                                                <div className="rounded-xl border border-zinc-200 border-dashed p-6 text-center text-zinc-400 text-xs font-medium select-none">
                                                    No example cases provided for this problem.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Code Editor & Console Output */}
                    <div className={`flex flex-col ${editorSize === "big" ? "lg:col-span-12" : "lg:col-span-7"} ${activeTab === "editor" || activeTab === "console" ? "block" : "hidden lg:block"}`}>
                        <Card
                            className="rounded-2xl border flex flex-col overflow-hidden h-full"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                                boxShadow: "0 4px 12px rgba(17,17,19,0.03)",
                            }}
                        >
                            {/* Editor Header Panel controls */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-zinc-100 bg-zinc-50/50 select-none">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center shadow">
                                        <Code2 size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-zinc-950">Code Workspace</span>
                                        <span className="ml-2 text-xs font-semibold text-zinc-500 uppercase px-2 py-0.5 bg-zinc-200/60 rounded">
                                            {language || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* Editor controls */}
                                <div className="flex items-center gap-2">
                                    {/* Editor Size Selector (Big/Small) */}
                                    <div className="hidden lg:flex items-center gap-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
                                        <button
                                            onClick={() => setEditorSize("small")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                editorSize === "small"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                                            }`}
                                            title="Split Layout"
                                        >
                                            Small
                                        </button>
                                        <button
                                            onClick={() => setEditorSize("big")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                editorSize === "big"
                                                    ? "bg-zinc-950 text-white shadow-sm"
                                                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                                            }`}
                                            title="Focus Layout (Big)"
                                        >
                                            Big
                                        </button>
                                    </div>

                                    {/* Font Size Selector */}
                                    <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-xl px-2 py-1 shadow-sm">
                                        <span className="text-xs text-zinc-400 font-bold px-1">Aa</span>
                                        <select
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="text-xs font-bold text-zinc-700 bg-transparent outline-none cursor-pointer"
                                        >
                                            <option value={13}>13px</option>
                                            <option value={15}>15px</option>
                                            <option value={17}>17px</option>
                                            <option value={19}>19px</option>
                                        </select>
                                    </div>

                                    {/* Word Wrap Toggle */}
                                    <button
                                        onClick={() => setWordWrap(wordWrap === "on" ? "off" : "on")}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                                            wordWrap === "on"
                                                ? "bg-zinc-950 text-white border-zinc-950"
                                                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                                        }`}
                                        title="Toggle Word Wrap"
                                    >
                                        Wrap
                                    </button>

                                    {/* Reset template */}
                                    <button
                                        onClick={resetTemplate}
                                        className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                        title="Reset Code Template"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Monaco Editor Container */}
                            <div className={`overflow-hidden bg-zinc-950 border-b border-zinc-100 ${activeTab === "console" ? "hidden lg:block" : "block"}`}>
                                <Editor
                                    height={editorSize === "big" ? "560px" : "420px"}
                                    language={language}
                                    value={code}
                                    theme="vs-dark"
                                    onChange={(value) => setCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: fontSize,
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        fontFamily: "JetBrains Mono, Fira Code, monospace",
                                        wordWrap: wordWrap,
                                        renderLineHighlight: "line",
                                        lineHeight: 22,
                                        cursorBlinking: "smooth",
                                        smoothScrolling: true,
                                        bracketPairColorization: { enabled: true },
                                    }}
                                />
                            </div>

                            {/* CLI Console Panel */}
                            <div className={`flex flex-col bg-zinc-950 border-t border-zinc-900 ${activeTab === "editor" ? "hidden lg:flex" : "flex flex-1"}`}>
                                <div className="h-10 bg-zinc-900/60 px-5 flex items-center justify-between border-b border-zinc-800/80 select-none">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Console Output</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {output && (
                                            <button
                                                onClick={() => setOutput("")}
                                                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition uppercase"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        {loading && (
                                            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 bg-zinc-950 min-h-[165px] font-mono text-xs flex-1 flex flex-col justify-start">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-3 select-none">
                                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="text-[11px] font-semibold text-indigo-400/90">Executing code on compiler sandbox...</div>
                                        </div>
                                    ) : output ? (
                                        <div className="space-y-1 select-text">
                                            <div className="text-zinc-500 text-[10px] border-b border-zinc-900 pb-1 mb-2 select-none">
                                                Status: <span className={output.includes("Error") || output.includes("Exception") ? "text-rose-500 font-black" : "text-emerald-500 font-black"}>{output.includes("Error") || output.includes("Exception") ? "FAILED" : "SUCCESS"}</span>
                                            </div>
                                            <pre className={`whitespace-pre-wrap leading-relaxed p-3 rounded-xl border ${
                                                output.includes("Error") || output.includes("Exception")
                                                    ? "text-rose-400 bg-rose-950/20 border-rose-900/40"
                                                    : "text-emerald-400 bg-emerald-950/10 border-emerald-900/30"
                                            }`}>
                                                {output}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-zinc-600 text-center gap-1.5 select-none">
                                            <Terminal className="w-5 h-5 text-zinc-700" />
                                            <span className="text-[11px]">Terminal is idle. Run your code to display stdout.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Actions Bar */}
                            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 select-none">
                                <button
                                    onClick={runCode}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-indigo-100"
                                >
                                    <Play className="w-4 h-4 fill-white text-white" />
                                    Run Code
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitLaoding || loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-black text-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:brightness-105"
                                    style={{
                                        background: theme.colors.lime,
                                        boxShadow: "0 4px 10px rgba(204,255,0,0.15)",
                                    }}
                                >
                                    {submitLaoding ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Submit Solution
                                </button>
                            </div>
                        </Card>
                    </div>

                </div>

                {/* Footer Pro Tip Panel */}
                <Card
                    className="rounded-2xl border"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                        boxShadow: "0 4px 12px rgba(17,17,19,0.03)",
                    }}
                >
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 border border-amber-200">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-zinc-950">
                                    Pro Developer Tip
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                    Write modular functions, verify variable scopes, and run test cases before submitting. Correct indentation helps debugging!
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center select-none">
                            <Badge variant="primary">
                                <SquareCode className="w-3.5 h-3.5 mr-1" />
                                Advanced Sandbox
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
}
