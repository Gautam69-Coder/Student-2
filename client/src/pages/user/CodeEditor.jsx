import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCodingPractices } from "@/api/api";
import { theme } from "@/lib/theme";
import { ArrowLeft, ArrowUpRight, AlertCircle, Code2, Play, Send, Sparkles, SquareCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Progress } from "/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/layout";


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
    };

    const style = variants[variant] || variants.neutral;

    return (
        <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold"
            style={style}
        >
            {children}
        </span>
    );
}

function PanelTitle({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: theme.colors.limeDim }}
            >
                <Icon size={18} color={theme.colors.dark} />
            </div>
            <div className="min-w-0">
                <h2 className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-[13px] font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                        {subtitle}
                    </p>
                )}
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

    const [code, setCode] = useState(`function solve() {
  console.log("Hello World");
}`);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setFetching(true);
            try {
                const res = await fetchCodingPractices();
                const list = Array.isArray(res?.data) ? res.data : [];
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
    const completion = 0;

    const runCode = async () => {
        try {
            setLoading(true);
            setOutput("Running...");

            const response = await axios.post(
                "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
                {
                    source_code: code,
                    language_id: 63,
                    stdin: "",
                }
            );

            setOutput(response.data.stdout || response.data.stderr || "No output");
        } catch (error) {
            setOutput("Error running code");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate(`/dashboard/coding-practice/${encodeURIComponent(String(language || "").toLowerCase())}`);
    };

    return (
        <DashboardLayout>
            <div >
                <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
                    <Card
                        className="rounded-2xl"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                        }}
                    >
                        <CardContent className="p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={goBack}
                                            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>

                                        <Badge variant="primary">
                                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                                            {String(language || "Language").toUpperCase()}
                                        </Badge>

                                        <Badge>
                                            <SquareCode className="w-3.5 h-3.5 mr-1" />
                                            Coding Workspace
                                        </Badge>
                                    </div>

                                    <h1
                                        className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
                                        style={{ color: theme.colors.dark }}
                                    >
                                        {data?.question || "Solve the problem"}
                                    </h1>

                                    <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7" style={{ color: theme.colors.darkGray }}>
                                        {data?.problemDiscription ||
                                            "Read the prompt, write your solution, and run it against the sample inputs before submitting."}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Badge variant="info">{data?.difficulty || "Unspecified"}</Badge>
                                        <Badge>{examples.length} Example{examples.length === 1 ? "" : "s"}</Badge>
                                        <Badge>{loading ? "Running..." : "Ready to code"}</Badge>
                                    </div>

                                    <div className="mt-6 max-w-xl">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span style={{ color: theme.colors.darkGray }}>Workspace progress</span>
                                            <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                {completion}% Completed
                                            </span>
                                        </div>
                                        <Progress
                                            value={completion}
                                            style={{
                                                height: 10,
                                                borderRadius: 999,
                                                backgroundColor: theme.colors.softGray,
                                                color: theme.colors.lime,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="w-full xl:w-[320px] shrink-0">
                                    <div
                                        className="rounded-2xl border p-5"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            boxShadow: "0 10px 0 rgba(17,17,19,0.06)",
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <Code2 className="w-4 h-4" style={{ color: theme.colors.dark }} />
                                                <span className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                                    Editor status
                                                </span>
                                            </div>
                                            <Badge variant="primary">Live</Badge>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span style={{ color: theme.colors.darkGray }}>Selected language</span>
                                                <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                    {language || "N/A"}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span style={{ color: theme.colors.darkGray }}>Examples loaded</span>
                                                <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                    {examples.length}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span style={{ color: theme.colors.darkGray }}>Output</span>
                                                <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                    {loading ? "Running" : "Idle"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={runCode}
                                            disabled={loading}
                                            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                            style={{
                                                background: theme.colors.lime,
                                                color: theme.colors.dark,
                                                boxShadow: "0 8px 0 rgba(17,17,19,0.18)",
                                            }}
                                        >
                                            <Play className="w-4 h-4" />
                                            Run Code
                                        </button>

                                        <button
                                            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black border transition-colors hover:bg-slate-50"
                                            style={{
                                                background: theme.colors.white,
                                                color: theme.colors.dark,
                                                borderColor: theme.colors.lightGray,
                                            }}
                                        >
                                            <Send className="w-4 h-4" />
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <Card
                            className="rounded-2xl"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                                boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                            }}
                        >
                            <CardHeader className="pb-2">
                                <PanelTitle
                                    icon={AlertCircle}
                                    title="Problem Statement"
                                    subtitle="Read the prompt and examples before writing your solution."
                                />
                            </CardHeader>
                            <CardContent className="pt-0">
                                {fetching ? (
                                    <div
                                        className="rounded-2xl border p-6 text-center font-semibold"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.darkGray,
                                        }}
                                    >
                                        Loading problem...
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border p-5" style={{ borderColor: theme.colors.lightGray }}>
                                        <h3 className="text-sm font-bold mb-2" style={{ color: theme.colors.dark }}>
                                            {data?.question || "No problem found"}
                                        </h3>
                                        <p className="text-sm leading-7" style={{ color: theme.colors.darkGray }}>
                                            {data?.problemDiscription || "No description available"}
                                        </p>

                                        <div className="mt-6 space-y-4">
                                            {examples.length ? (
                                                examples.map((example, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-2xl border p-4"
                                                        style={{
                                                            background: theme.colors.softGray,
                                                            borderColor: theme.colors.lightGray,
                                                        }}
                                                    >
                                                        <div className="mb-2 text-sm font-bold" style={{ color: theme.colors.dark }}>
                                                            Example {index + 1}
                                                        </div>
                                                        <div className="text-sm leading-7" style={{ color: theme.colors.darkGray }}>
                                                            <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                                Input:
                                                            </span>{" "}
                                                            {example.input}
                                                        </div>
                                                        <div className="mt-2 text-sm leading-7" style={{ color: theme.colors.darkGray }}>
                                                            <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                                Output:
                                                            </span>{" "}
                                                            {example.output}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: theme.colors.lightGray, color: theme.colors.darkGray }}>
                                                    No examples provided for this problem.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card
                            className="rounded-2xl"
                            style={{
                                background: theme.colors.white,
                                borderColor: theme.colors.lightGray,
                                boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                            }}
                        >
                            <CardHeader className="pb-2">
                                <PanelTitle
                                    icon={ArrowUpRight}
                                    title="Code Editor"
                                    subtitle="Write your solution and check the output below."
                                />
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.colors.lightGray }}>
                                    <Editor
                                        height="460px"
                                        language={language}
                                        value={code}
                                        theme="vs-dark"
                                        onChange={(value) => setCode(value || "")}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 15,
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            padding: { top: 16, bottom: 16 },
                                            fontFamily: "JetBrains Mono, monospace",
                                            wordWrap: "on",
                                            renderLineHighlight: "line",
                                        }}
                                    />
                                </div>

                                <div
                                    className="mt-4 rounded-2xl border overflow-hidden"
                                    style={{ borderColor: theme.colors.lightGray }}
                                >
                                    <div
                                        className="h-12 flex items-center px-5 border-b"
                                        style={{
                                            background: theme.colors.softGray,
                                            borderColor: theme.colors.lightGray,
                                        }}
                                    >
                                        <span className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                            Console Output
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <pre
                                            className="text-sm font-mono whitespace-pre-wrap min-h-[96px]"
                                            style={{ color: loading ? "#2563EB" : "#15803D" }}
                                        >
                                            {output || "Run your code to see output"}
                                        </pre>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card
                        className="rounded-2xl"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                        }}
                    >
                        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                    Tip
                                </div>
                                <div className="text-sm mt-1" style={{ color: theme.colors.darkGray }}>
                                    Keep your solution clean and test edge cases before submitting.
                                </div>
                            </div>

                            <Badge variant="primary">
                                <Sparkles className="w-3.5 h-3.5 mr-1" />
                                Dashboard Style
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
