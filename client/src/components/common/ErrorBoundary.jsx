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
                <div className="min-h-[300px] w-full flex items-center justify-center p-6 bg-muted/40 rounded-2xl border border-border my-4 text-foreground">
                    <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 shadow-xl text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                            <AlertTriangle size={24} aria-hidden="true" />
                        </div>

                        <h3 className="text-base font-bold text-foreground mb-1">
                            Something went wrong rendering this section
                        </h3>

                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {this.state.error?.message || "An unexpected error occurred while processing this component."}
                        </p>

                        <div className="flex items-center gap-2.5 w-full">
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="flex-1 min-h-[40px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 active:scale-[0.98] text-xs font-semibold text-primary-foreground transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <RefreshCw size={14} aria-hidden="true" />
                                Try Again
                            </button>

                            <button
                                type="button"
                                onClick={() => { window.location.href = '/dashboard'; }}
                                className="flex-1 min-h-[40px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 active:scale-[0.98] text-xs font-semibold text-secondary-foreground transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <Home size={14} aria-hidden="true" />
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
