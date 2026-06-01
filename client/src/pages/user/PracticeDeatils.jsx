import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCodingPractices } from '@/api/api';
import { useNavigate } from "react-router-dom";

import {
    ArrowUpRight,
    ChevronUp,
    // Certificate,
    Star,
    Clock3,
    BookOpen,
    Users,
} from "lucide-react";

const HeroCard = ({ data, language }) => {

    return (
        <div className="w-full">
            <div
                className="relative overflow-hidden rounded-3xl p-8  shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg, #2563eb 0%, rgba(37,99,235,0.35) 18%, rgba(31,35,45,1) 65%, rgba(17,24,39,1) 100%)",
                }}
            >
                {/* Grid overlay pattern */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
                        backgroundSize: "46px 46px",
                    }}
                />

                <div className="relative z-10 flex items-start justify-between gap-8 h-full">
                    {/* Left section */}
                    <div className="min-w-0">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-xl bg-sky-200/15 border border-sky-200/20 flex items-center justify-center">
                                {/* Simple C++ mark */}
                                <div className="w-8 h-8  flex items-center justify-center">
                                    <span className="text-sky-100 font-black text-sm">C++</span>
                                </div>
                            </div>

                            <div className="pt-1">

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                                    Practice {language.toUpperCase() || 'N/A'}
                                </h1>
                            </div>
                        </div>

                        <p className="mt-4 text-slate-300 text-sm sm:text-[15px] leading-6 max-w-[650px]">
                            {data?.description || 'N/A'}
                        </p>

                        {/* Stats row */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-300" />
                                <span className="text-white font-semibold">22 Lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock3 className="w-4 h-4 text-slate-300" />
                                <span className="text-white font-semibold">10 Hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-slate-300" />
                                <span className="text-white font-semibold">{data?.problems || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-300" />
                                <span className="text-white font-semibold">{data?.learners || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-white/15 border border-white/15 inline-block" />
                                <span className="text-white font-semibold">{data?.level || 'N/A'} Level</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side badges + button */}
                    <div className="flex flex-col items-end gap-4">
                        <div className="relative">
                            {/* <div className="absolute right-0 -top-3 translate-x-1">
                                <div className="flex items-center gap-2 bg-white/90 border border-white/40 text-blue-700 rounded-xl px-4 py-2 shadow-md">
                                    <Certificate className="w-4 h-4" />
                                    <span className="text-sm font-semibold whitespace-nowrap">
                                        Certification Available
                                    </span>
                                </div>
                            </div> */}

                            <div className="flex items-center gap-2 bg-yellow-400/90 border border-yellow-300/40 text-yellow-900 rounded-xl px-4 py-2 shadow-md">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-semibold whitespace-nowrap">
                                    4.5 (25.9k+)
                                </span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="w-[320px] max-w-[65vw]">
                            <div className="flex items-center justify-between">
                                <div className="text-slate-200 text-sm">
                                    Your Progress :
                                    <span className="ml-2 text-green-400 font-semibold">
                                        0% Completed
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 h-2 w-full rounded-full bg-slate-900/70 overflow-hidden">
                                <div className="h-full w-[0%] bg-blue-500/40 transition-all" />
                            </div>
                        </div>

                        <button
                            className="mt-1 inline-flex items-center justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transform transition-transform hover:scale-[1.03] active:scale-[0.99]"
                        >
                            Start Learning
                        </button>

                        <div className="text-slate-200/60 text-xs font-medium">
                            {/* spacing filler for alignment */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseSection = () => {
    return (
        <div className="mt-6 rounded-3xl bg-slate-900/40 border border-slate-700/50 overflow-hidden shadow-sm">
            <div className="h-[120px] bg-transparent p-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-950/70 border border-slate-700/60 flex items-center justify-center text-white font-bold">
                        1
                    </div>

                    <div>
                        <h2 className="text-white font-extrabold text-xl">
                            Output & Basic math operators
                        </h2>
                        <p className="mt-1 text-slate-400 text-sm max-w-[640px]">
                            Practice problems using C++ related to output and output on multiple lines
                        </p>
                        <div className="mt-3 text-white font-bold">
                            <span className="text-white/90">0%</span> Solved
                        </div>
                    </div>
                </div>

                <div className="text-slate-300/80">
                    <ChevronUp className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

const ProblemTable = ({ data, language }) => {

    const navigate = useNavigate();
    const problems = data?.problemList || [];

    return (
        <div className="mt-6 rounded-3xl bg-slate-900/40 border border-slate-700/50 overflow-hidden shadow-sm">

            <table className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 w-16">
                            Sr. No.
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                            Question
                        </th>

                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300 w-28">
                            Status
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300 w-32">
                            Difficulty
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/50 w-full">
                    {problems.map((p, index) => (
                        <tr
                            key={index}
                            className="border-b border-slate-800  hover:bg-slate-800/40 transition-colors"
                        >

                            <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                {index + 1}
                            </td>

                            {/* Question */}
                            <td className="px-6 py-5">
                                <button
                                    onClick={() =>{
                                        navigate(`/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(String(p._id).toLowerCase())
                                            }`)
                                        console.log(p._id)
                                    }
                                        
                                        }
                                    className="text-blue-400 cursor-pointer hover:text-blue-300 hover:underline font-medium text-left">
                                    {p.question}
                                </button>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-5 text-center">
                                <div className="inline-flex h-5 w-5 rounded-full border border-slate-500" />
                            </td>

                            {/* Difficulty */}
                            <td className="px-6 py-5 text-right">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${p.difficulty === "Easy"
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : p.difficulty === "Medium"
                                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}
                                >
                                    {p.difficulty}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};


export default function PracticeDeatils() {
    const { language } = useParams();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const res = await fetchCodingPractices();
            // console.log(res.data)
            const filterLanguage = res.data.find(
                item => item.language.toLowerCase() === language.toLowerCase()
            );
            setData(filterLanguage || {});
        } catch (e) {
            console.error("Error fetching coding practices:", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, [language]);

    return (
        <div className="py-2">
            <div className=" mx-auto ">
                <div className="rounded-2xl">
                    <div className=" rounded-3xl p-4 ">
                        <HeroCard data={data} language={language} />
                        <CourseSection />
                        <ProblemTable data={data} language={language} />
                    </div>
                </div>
            </div>
        </div>
    );
}

