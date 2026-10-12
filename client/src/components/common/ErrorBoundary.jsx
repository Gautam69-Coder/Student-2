import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('🛑 Uncaught Error in Component Tree:', error, errorInfo);
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function'
                    ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
                    : this.props.fallback;
            }

            return (
                <div className="min-h-[300px] w-full flex items-center justify-center p-6 bg-zinc-950/40 rounded-2xl border border-zinc-800/80 my-4 text-zinc-100">
                    <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                            <AlertTriangle size={24} />
                        </div>

                        <h3 className="text-base font-bold text-white mb-1">
                            Something went wrong rendering this section
                        </h3>

                        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                            {this.state.error?.message || "An unexpected error occurred while processing this component."}
                        </p>

                        <div className="flex items-center gap-2.5 w-full">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                            >
                                <RefreshCw size={14} />
                                Try Again
                            </button>

                            <button
                                onClick={() => { window.location.href = '/dashboard'; }}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                            >
                                <Home size={14} />
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
