import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

export const NotFoundPage = ({ status = 404, message = "Page Not Found" }) => {
    useTitle(`${status} - ${message}`);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
            <div className="fixed inset-0 bg-studio-grid opacity-60 pointer-events-none" />
            <div
                className="fixed inset-x-0 -top-40 h-[420px] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(79, 70, 229, 0.14), rgba(16, 185, 129, 0.06) 55%, transparent 100%)",
                }}
            />

            <div className="max-w-md w-full surface-card rounded-3xl p-8 sm:p-10 relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-primary mb-5">
                    <AlertCircle size={30} aria-hidden="true" />
                </div>

                <span className="text-xs font-bold tracking-wider text-primary uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-3 tabular-nums">
                    Error {status}
                </span>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
                    {message}
                </h1>

                <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs">
                    {status === 404
                        ? "The page you are looking for doesn't exist or has been moved."
                        : "Something went wrong processing this request. Please try again."}
                </p>

                <div className="flex items-center gap-3 w-full">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold text-foreground transition-colors"
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground transition-colors shadow-sm shadow-indigo-500/20"
                    >
                        <Home size={15} aria-hidden="true" />
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
