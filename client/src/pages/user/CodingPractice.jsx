import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as icons from 'simple-icons';
import { fetchCodingPractices } from '@/api/api';

const CodingPractice = () => {
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetchCodingPractices();
                if (!isMounted) return;

                setCards(Array.isArray(res?.data) ? res.data : []);
            } catch (e) {
                if (!isMounted) return;
                setError(e);
                setCards([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, []);

    function getBrandColor(language = '') {
        const normalized = String(language);
        const key = `si${normalized.charAt(0).toUpperCase()}${normalized.slice(1).toLowerCase()}`;
        const icon = icons[key];
        return icon ? `#${icon.hex}` : '#3B82F6';
    }

    return (
        <div className="w-full mx-auto px-2 sm:px-4">
            <section className="mt-6 my-10 dark:border-slate-800/70 backdrop-blur-sm shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Welcome to Coding Practice! 👋
                </h1>
                <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    Sharpen your problem-solving by practicing small coding challenges daily—start simple, write clean logic,
                    and improve with every attempt.
                </p>
            </section>

            <section className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">Choose a practice track</h2>

                {loading ? (
                    <div className="text-slate-500">Loading tracks...</div>
                ) : error ? (
                    <div className="text-red-500">Failed to load tracks</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((item, index) => {
                            const color = getBrandColor(item.language);

                            return (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    key={item._id || item.language || index}
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/coding-practice/${encodeURIComponent(
                                                String(item.language || item.title || 'html')
                                                    .replace(/^practice\s*/i, '')
                                                    .toLowerCase()
                                            )}`
                                        )
                                    }
                                    className="group relative overflow-hidden rounded-3xl bg-[#0f172a] border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                >
                                    <div
                                        className="h-28 relative"
                                        style={{
                                            background: `linear-gradient(135deg, ${color}, ${color}99)`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>

                                    <div className="absolute top-14 left-6">
                                        <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-[#0f172a]">
                                            <img
                                                src={`https://cdn.simpleicons.org/${String(item.language || '').toLowerCase()}`}
                                                alt={item.language}
                                                className="w-10 h-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 pt-14 pb-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-white">{item.title}</h2>
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                                                {item.language}
                                            </span>
                                        </div>

                                        <p className="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-2">{item.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <p className="text-slate-400 text-xs uppercase">Problems</p>
                                                <h3 className="text-white text-2xl font-bold mt-1">{item.problemList.map(i=>i).length}</h3>
                                            </div>

                                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                                <p className="text-slate-400 text-xs uppercase">Level</p>
                                                <h3 className="text-white text-lg font-semibold mt-2">{item.level}</h3>
                                            </div>
                                        </div>

                                        <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all duration-300 group-hover:scale-[1.02]">
                                            Start Practice →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export { CodingPractice };

