import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCodingPractices, updateProblemStatus, codeChecker } from "@/Api/api";
import { copyToClipboard } from "@/Utils/clipboard";
import { useTheme } from "@/context/ThemeContext";
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
    Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/layout";
import { customMessage } from "@/Utils/customMessage";

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
}`,
};

function Badge({ children, variant = "neutral" }) {
    const cls = {
        neutral: "bg-secondary border-border text-foreground",
        primary: "bg-indigo-500/12 border-indigo-500/25 text-indigo-700 dark:text-indigo-300",
        info: "bg-sky-500/12 border-sky-500/25 text-sky-700 dark:text-sky-300",
        success: "bg-emerald-500/12 border-emerald-500/25 text-emerald-700 dark:text-emerald-300",
        warning: "bg-amber-500/12 border-amber-500/25 text-amber-700 dark:text-amber-300",
        danger: "bg-rose-500/12 border-rose-500/25 text-rose-700 dark:text-rose-300",
    }[variant] || "bg-secondary border-border text-foreground";

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${cls}`}>
            {children}
        </span>
    );
}

function ExampleCard({ index, example }) {
    const [copiedInput, setCopiedInput] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);

    const handleCopy = async (text, setCopied) => {
        if (!text) return;
        const success = await copyToClipboard(text);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="rounded-2xl border border-border overflow-hidden bg-background">
            <div className="h-10 bg-secondary/50 px-4 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    Example {index + 1}
                </span>
            </div>
            <div className="p-4 space-y-3 font-mono text-xs">
                <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        <span>Input</span>
                        <button
                            type="button"
                            onClick={() => handleCopy(example.input, setCopiedInput)}
                            className="text-[11px] text-muted-foreground hover:text-foreground transition flex items-center gap-1 bg-card border border-border rounded-md px-2 py-0.5 font-sans"
                        >
                            {copiedInput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedInput ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <pre className="bg-[#0D1117] text-slate-100 p-3 rounded-xl overflow-x-auto leading-relaxed border border-white/5">
                        {example.input}
                    </pre>
                </div>
                <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        <span>Output</span>
                        <button
                            type="button"
                            onClick={() => handleCopy(example.output, setCopiedOutput)}
                            className="text-[11px] text-muted-foreground hover:text-foreground transition flex items-center gap-1 bg-card border border-border rounded-md px-2 py-0.5 font-sans"
                        >
                            {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedOutput ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <pre className="bg-[#0D1117] text-emerald-400 p-3 rounded-xl overflow-x-auto leading-relaxed border border-white/5">
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
    const { darkMode } = useTheme();

    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [fetching, setFetching] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [fontSize, setFontSize] = useState(15);
    const [wordWrap, setWordWrap] = useState("on");
    const [activeTab, setActiveTab] = useState("description");
    const [editorSize, setEditorSize] = useState("small");

    const [code, setCode] = useState(`function solve() {\n  console.log("Hello World");\n}`);

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

        const handleSync = () => fetchData();
        window.addEventListener("coding-practice-sync", handleSync);

        return () => {
            mounted = false;
            window.removeEventListener("coding-practice-sync", handleSync);
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
            setSubmitLoading(true);
            await runCode();

            const question = data?.question || "hello";
            const outputVal = data?.examples?.[0]?.output || "";

            const check = await codeChecker({ question, code, output: outputVal });

            if (!check.data || check.data.message === undefined) {
                customMessage({
                    type: "error",
                    content: "Failed to evaluate code. Check connection!",
                });
                return;
            }

            if (check.data.data === "true") {
                const day = new Date().toLocaleString("en-US", { weekday: "long" });
                const updateStatus = await updateProblemStatus({ problemId, language, day });

                if (updateStatus.data.success === true) {
                    customMessage({
                        type: "success",
                        content: "Excellent! Your solution passed and was saved.",
                    });

                    setTimeout(() => {
                        goBack();
                    }, 1500);
                } else {
                    customMessage({
                        type: "success",
                        content: "Code evaluated correctly! Status updated.",
                    });
                }
            } else {
                customMessage({
                    type: "error",
                    content: "Incorrect solution. Verify example test cases!",
                });
            }
        } catch (err) {
            console.error(err);
            customMessage({
                type: "error",
                content: "Error submitting solution.",
            });
        } finally {
            setSubmitLoading(false);
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
            content: "Workspace code reset to default template.",
        });
    };

    const goBack = () => {
        navigate(`/dashboard/coding-practice/${encodeURIComponent(String(language || "").toLowerCase())}`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Breadcrumb Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center justify-center min-h-[42px] min-w-[42px] rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-all active:scale-95 shrink-0"
                            aria-label="Go Back"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <span>Practice</span>
                                <span>/</span>
                                <span className="text-foreground">{String(language || "").toUpperCase()}</span>
                                <span>/</span>
                                <span>IDE</span>
                            </div>
                            <h1 className="text-lg sm:text-2xl font-extrabold text-foreground truncate mt-0.5">
                                {data?.question || "Solve the problem"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                        <Badge variant="primary">
                            <Sparkles className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                            Live Sandbox
                        </Badge>
                        {data?.difficulty && (
                            <Badge
                                variant={
                                    data.difficulty.toLowerCase() === "easy"
                                        ? "success"
                                        : data.difficulty.toLowerCase() === "medium"
                                        ? "warning"
                                        : data.difficulty.toLowerCase() === "hard"
                                        ? "danger"
                                        : "neutral"
                                }
                            >
                                {data.difficulty}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Mobile Workspace Tabs */}
                <div className="flex lg:hidden items-center border border-border bg-card p-1 rounded-2xl gap-1">
                    {["description", "editor", "console"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-h-[40px] text-xs font-bold rounded-xl capitalize transition-all relative ${
                                activeTab === tab
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                        >
                            {tab === "console" ? "Console Output" : tab}
                            {tab === "console" && output && (
                                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Split Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Problem Description */}
                    <div
                        className={`lg:col-span-5 flex flex-col ${editorSize === "big" ? "lg:hidden" : ""} ${
                            activeTab === "description" ? "block" : "hidden lg:block"
                        }`}
                    >
                        <Card className="surface-card rounded-3xl py-0 flex flex-col h-full">
                            <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                                    <CardTitle className="text-base font-bold text-foreground">
                                        Problem Description
                                    </CardTitle>
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                                    {examples.length} Example{examples.length === 1 ? "" : "s"}
                                </span>
                            </CardHeader>

                            <CardContent className="p-5 flex-1 flex flex-col overflow-y-auto max-h-[700px]">
                                {fetching ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                        <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="font-semibold text-xs">Loading problem details...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-base font-bold text-foreground mb-2">
                                                {data?.question || "No problem found"}
                                            </h2>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {data?.problemDiscription || "No description available."}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Code2 className="w-4 h-4 text-primary" aria-hidden="true" />
                                                Examples
                                            </h3>
                                            {examples.length ? (
                                                examples.map((example, index) => (
                                                    <ExampleCard key={index} index={index} example={example} />
                                                ))
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-xs">
                                                    No example cases provided for this problem.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monaco Editor & Console */}
                    <div
                        className={`flex flex-col ${editorSize === "big" ? "lg:col-span-12" : "lg:col-span-7"} ${
                            activeTab === "editor" || activeTab === "console" ? "block" : "hidden lg:block"
                        }`}
                    >
                        <Card className="surface-card rounded-3xl py-0 flex flex-col overflow-hidden h-full">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-secondary/40">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center">
                                        <Code2 size={16} aria-hidden="true" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-foreground">Code Workspace</span>
                                        <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase px-2 py-0.5 bg-background border border-border rounded-md">
                                            {language || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="hidden lg:flex items-center gap-1 bg-background border border-border rounded-xl p-1">
                                        <button
                                            type="button"
                                            onClick={() => setEditorSize("small")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                                editorSize === "small"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Split
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditorSize("big")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                                editorSize === "big"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            Expand
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2 py-1">
                                        <span className="text-xs text-muted-foreground font-bold px-1">Aa</span>
                                        <select
                                            aria-label="Editor font size"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="text-xs font-bold text-foreground bg-transparent outline-none"
                                        >
                                            <option value={13}>13px</option>
                                            <option value={15}>15px</option>
                                            <option value={17}>17px</option>
                                            <option value={19}>19px</option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setWordWrap(wordWrap === "on" ? "off" : "on")}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                                            wordWrap === "on"
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background text-muted-foreground border-border hover:text-foreground"
                                        }`}
                                    >
                                        Wrap
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetTemplate}
                                        aria-label="Reset code template"
                                        title="Reset Code Template"
                                        className="p-2 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            {/* Monaco Editor */}
                            <div
                                className={`overflow-hidden border-b border-border ${
                                    activeTab === "console" ? "hidden lg:block" : "block"
                                }`}
                            >
                                <Editor
                                    height={editorSize === "big" ? "560px" : "420px"}
                                    language={language}
                                    value={code}
                                    theme={darkMode ? "vs-dark" : "light"}
                                    onChange={(value) => setCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize,
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        fontFamily: "JetBrains Mono, Fira Code, monospace",
                                        wordWrap,
                                        renderLineHighlight: "line",
                                        lineHeight: 22,
                                        cursorBlinking: "smooth",
                                        smoothScrolling: true,
                                        bracketPairColorization: { enabled: true },
                                    }}
                                />
                            </div>

                            {/* Console */}
                            <div
                                className={`flex flex-col bg-[#0D1117] text-slate-100 ${
                                    activeTab === "editor" ? "hidden lg:flex" : "flex flex-1"
                                }`}
                            >
                                <div className="h-10 bg-white/[0.03] px-5 flex items-center justify-between border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Console Output
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {output && (
                                            <button
                                                type="button"
                                                onClick={() => setOutput("")}
                                                className="text-[11px] font-bold text-slate-400 hover:text-white transition uppercase"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        {loading && (
                                            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 min-h-[160px] font-mono text-xs flex-1 flex flex-col justify-start">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2.5">
                                            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-xs text-indigo-300">
                                                Executing code in sandbox...
                                            </span>
                                        </div>
                                    ) : output ? (
                                        <div className="space-y-2">
                                            <div className="text-slate-400 text-[11px] border-b border-white/10 pb-1.5">
                                                Status:{" "}
                                                <span
                                                    className={
                                                        output.includes("Error") || output.includes("Exception")
                                                            ? "text-rose-400 font-bold"
                                                            : "text-emerald-400 font-bold"
                                                    }
                                                >
                                                    {output.includes("Error") || output.includes("Exception")
                                                        ? "FAILED"
                                                        : "SUCCESS"}
                                                </span>
                                            </div>
                                            <pre
                                                className={`whitespace-pre-wrap leading-relaxed p-3 rounded-xl border ${
                                                    output.includes("Error") || output.includes("Exception")
                                                        ? "text-rose-300 bg-rose-950/30 border-rose-900/40"
                                                        : "text-emerald-300 bg-emerald-950/20 border-emerald-900/40"
                                                }`}
                                            >
                                                {output}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-center gap-1.5">
                                            <Terminal className="w-5 h-5 text-slate-600" aria-hidden="true" />
                                            <span className="text-xs">
                                                Terminal is idle. Run your code to inspect output.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Action Bar */}
                            <div className="p-4 bg-secondary/40 border-t border-border flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={runCode}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 min-h-[42px] text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm shadow-indigo-500/20"
                                >
                                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                                    Run Code
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitLoading || loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 min-h-[42px] text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm shadow-emerald-500/20"
                                >
                                    {submitLoading ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                    Submit Solution
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Pro Tip */}
                <Card className="surface-card rounded-2xl py-0">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/12 border border-amber-500/25">
                                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-foreground">Pro Developer Tip</div>
                                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    Verify variable scopes and test edge cases with "Run Code" before clicking "Submit Solution".
                                </div>
                            </div>
                        </div>

                        <Badge variant="primary">
                            <SquareCode className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                            Monaco Sandbox
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
