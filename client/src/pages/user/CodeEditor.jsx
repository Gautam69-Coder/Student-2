import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchCodingPractices } from '@/Api/api';
import { useEffect } from "react";



const CodeEditor = () => {
  // const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const { problemId, language } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(`function solve() {
  console.log("Hello World");
}`);

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
      setOutput(
        response.data.stdout || response.data.stderr || "No output"
      );
    } catch (error) {
      setOutput("Error running code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetchCodingPractices();
      // console.log(res.data)
      const filterLanguage = res.data.find(
        item => item.language.toLowerCase() === language.toLowerCase()
      );

      const filterProblem = filterLanguage?.problemList.find(
        problem => problem._id == problemId
      );

      // console.log("Filtered Language:", filterLanguage);
      // console.log("Filtered Problem:", filterProblem.examples);
      setData(filterProblem || {});
    } catch (e) {
      console.error("Error fetching coding practices:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language]);


  return (
    <div className="min-h-screen w-full bg-background dark:bg-slate-950 transition-colors duration-300">
      {/* Page header */}
      <div className=" mx-auto  ">
        <div className="glass-card rounded-3xl overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0b1220] border border-white/10 flex items-center justify-center neon-glow">
                <div className="w-3 h-3 rounded-full bg-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  Coding Workspace
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Solve, run, and iterate</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 text-[12px] uppercase py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300  font-semibold">
                {language}
              </div>

              <button
                onClick={() => { runCode() }}
                className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Run
              </button>

              <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/90 to-indigo-500/90 border border-white/10 text-white text-sm font-semibold hover:opacity-95 transition-all">
                Submit
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 xl:grid-cols-2">
            {/* Left: problem */}
            <aside className="border-b xl:border-b-0 xl:border-r border-white/10">
              <div className="h-full overflow-auto p-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      {"Problem Title"}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                      Problem
                    </span>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-bold text-cyan-300 mb-2">
                        {data?.question || "No problem found"}
                      </h3>
                      <p className="text-sm leading-7 text-slate-300">
                        {data?.problemDiscription || "No description available"}
                      </p>
                    </section>

                    {data?.examples?.map((e, index) => (
                      <section key={index}>
                        <h3 className="text-sm font-bold text-cyan-300 mb-2">
                          Example {index+1}
                        </h3>
                        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-sm">
                          <div className="text-slate-300">
                            <span className="text-white">Input:</span> {e.input}
                          </div>
                          <div className="mt-2 text-slate-300">
                            <span className="text-white">Output:</span> {e.output}
                          </div>
                        </div>
                      </section>
                    ))}

                    <section>
                      <h3 className="text-sm font-bold text-cyan-300 mb-2">
                        Constraints
                      </h3>
                      <ul className="list-disc ml-5 text-sm text-slate-300 space-y-2">
                        <li>2 ≤ nums.length ≤ 10^4</li>
                        <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                        <li>-10^9 ≤ target ≤ 10^9</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right: editor + output */}
            <main className="flex flex-col p-4 ">
              <div className="min-h-[420px] rounded-t-2xl overflow-hidden border border-white/10">
                <Editor
                  height="100%"
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

              <div className="border-t rounded-b-2xl border-white/10 bg-black/20">
                <div className="h-12 flex items-center px-5 border-b border-white/10">
                  <span className="text-sm font-semibold text-cyan-300">
                    Console Output
                  </span>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-green-300 whitespace-pre-wrap font-mono">
                    {output || "Run your code to see output"}
                  </pre>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Tip: Keep your solution clean and test edge cases.
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
