import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, AlertCircle } from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

export const NotFoundPage = ({ status = 404, message = "Page Not Found" }) => {
    useTitle(`${status} - ${message}`);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden select-none">
            {/* Background ambient glow */}
            <div className="w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl absolute -top-20 -left-20 pointer-events-none" />
            <div className="w-96 h-96 bg-violet-600/20 rounded-full blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

            <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                    <AlertCircle size={32} />
                </div>

                <span className="text-xs font-black tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-full mb-3">
                    Error {status}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    {message}
                </h1>

                <p className="text-sm text-zinc-400 mb-8 leading-relaxed max-w-xs">
                    {status === 404
                        ? "The page you are looking for doesn't exist or has been moved to another URL."
                        : "Something went wrong processing this request. Please try again or head back."}
                </p>

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-xs font-bold text-zinc-200 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
                    >
                        <Home size={16} />
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
