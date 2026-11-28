import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import { customMessage } from "@/Utils/customMessage";
import { Link } from "react-router-dom";
import { googleLogin, registerUser, loginUser } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
    GraduationCap,
    Shield,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    KeyRound,
    Code2,
    BookOpen,
    Sparkles,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";

const quotes = [
    { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
];

export function AuthSection({ authState, setAuthState, onAuth, isModal = false }) {
    useTitle(authState === "login" ? "Login" : "Sign Up");
    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adminSecret, setAdminSecret] = useState("");
    const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const user = result.user;
                    const token = await user.getIdToken();
                    const res = await googleLogin(token);

                    localStorage.setItem("isAuthenticated", "true");
                    if (res.data.data?.token) {
                        localStorage.setItem("token", res.data.data.token);
                    }

                    if (res.data.data?.user) {
                        onAuth(res.data.data.user.role, res.data.data.user.username);
                        customMessage({
                            type: "success",
                            content: `${res.data.message}, ${res.data.data.user.username}!`,
                        });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        handleRedirect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const userData = {
                username: name,
                email,
                password,
                role,
                adminSecret,
            };

            const loginData = {
                email,
                password,
            };

            const res = authState === "login" ? await loginUser(loginData) : await registerUser(userData);
            localStorage.setItem("isAuthenticated", "true");
            if (res.data.data?.token) {
                localStorage.setItem("token", res.data.data.token);
            }

            if (res.data.data?.user) {
                onAuth(res.data.data.user.role, res.data.data.user.username);
                customMessage({
                    type: "success",
                    content: `${authState === "login" ? "Login" : "Sign Up"} successful! ${authState === "login" ? "Welcome back" : "Welcome"}, ${res.data.data.user.username}!`,
                });
            }
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.msg ||
                err.response?.data?.message ||
                err.message ||
                "An error occurred during authentication";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            setError(null);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();
            const res = await googleLogin(token);

            localStorage.setItem("isAuthenticated", "true");
            if (res.data.data?.token) {
                localStorage.setItem("token", res.data.data.token);
            }

            if (res.data.data?.user) {
                onAuth(res.data.data.user.role, res.data.data.user.username);
                customMessage({
                    type: "success",
                    content: `${res.data.message}, ${res.data.data.user.username}!`,
                });
            }
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.msg ||
                err.response?.data?.message ||
                err.message ||
                "An error occurred during authentication";
            setError(message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className={`${isModal ? "w-full" : "min-h-screen flex flex-col lg:flex-row"} w-full relative`}>
            {/* Top Utility Bar */}
            {!isModal && (
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between max-w-7xl mx-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card/90 backdrop-blur-md text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        Back to Home
                    </Link>
                    <ThemeToggle />
                </div>
            )}

            {/* Left Brand & Value Showcase Panel */}
            {!isModal && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 xl:px-20 py-16 border-r border-border bg-card/40 backdrop-blur-sm"
                >
                    <div className="max-w-lg space-y-8">
                        <Link to="/" className="inline-flex items-center gap-3 group w-fit">
                            <img
                                src="/circle_logo.png"
                                alt="Student Hub Logo"
                                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                            <span className="text-2xl font-extrabold tracking-tight text-foreground">
                                Student Hub
                            </span>
                        </Link>

                        <div className="space-y-3">
                            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                                Your unified workspace for notes, labs, and coding practice.
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Pick up right where you left off across curated subject notes, verified practical sheets, and 50+ browser-ready coding challenges.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                {
                                    icon: Code2,
                                    title: "50+ Preloaded Coding Problems",
                                    desc: "JavaScript, Python, C++, Java & DSA inside a Monaco IDE.",
                                    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                                },
                                {
                                    icon: BookOpen,
                                    title: "Organized Notes & Practicals",
                                    desc: "Inline file previews, markdown notes, and lab solutions.",
                                    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                },
                                {
                                    icon: Sparkles,
                                    title: "24/7 AI Study & Code Helper",
                                    desc: "Debug edge cases and simplify tough syllabus topics fast.",
                                    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-3.5 p-4 rounded-2xl border border-border bg-card shadow-2xs"
                                    >
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                                            <Icon className="w-5 h-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-border">
                            <blockquote className="text-sm italic text-muted-foreground leading-relaxed">
                                "{currentQuote.text}"
                            </blockquote>
                            <p className="text-xs font-semibold text-foreground mt-1.5">— {currentQuote.author}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Right Side - Auth Form */}
            <div className={`${isModal ? "w-full" : "w-full lg:w-1/2 min-h-screen"} flex items-center justify-center p-4 sm:p-8 pt-20 lg:pt-8`}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="surface-card rounded-3xl p-6 sm:p-8">
                        <div className="text-center mb-6 space-y-1.5">
                            <div className="lg:hidden flex justify-center mb-3">
                                <img src="/circle_logo.png" alt="Student Hub" className="h-10 w-10 object-contain" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                                {authState === "login" ? "Welcome back" : "Create your account"}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {authState === "login"
                                    ? "Sign in to access your study workspace"
                                    : "Start organizing notes and solving challenges"}
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-secondary border border-border mb-5">
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`flex items-center justify-center gap-2 min-h-[40px] px-3 rounded-lg text-xs font-bold transition-all ${
                                    role === "user"
                                        ? "bg-card text-foreground shadow-xs border border-border"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex items-center justify-center gap-2 min-h-[40px] px-3 rounded-lg text-xs font-bold transition-all ${
                                    role === "admin"
                                        ? "bg-card text-foreground shadow-xs border border-border"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                Admin
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                role="alert"
                                className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-semibold flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence initial={false}>
                                {authState === "signup" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="name"
                                                type="text"
                                                required={authState === "signup"}
                                                placeholder="Aarav Sharma"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="student@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-xs font-semibold text-foreground mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full min-h-[44px] pl-10 pr-11 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {authState === "signup" && role === "admin" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <label htmlFor="adminSecret" className="block text-xs font-semibold text-foreground mb-1.5">
                                                Admin Secret Key
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                                <input
                                                    id="adminSecret"
                                                    type="password"
                                                    placeholder="Enter admin secret"
                                                    value={adminSecret}
                                                    onChange={(e) => setAdminSecret(e.target.value)}
                                                    className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                                    required={role === "admin"}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all active:scale-[0.98] shadow-sm shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                        <span>{authState === "login" ? "Signing in..." : "Creating account..."}</span>
                                    </>
                                ) : (
                                    <span>{authState === "login" ? "Sign In" : "Create Account"}</span>
                                )}
                            </button>

                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                                    <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={googleLoading}
                                onClick={handleGoogleLogin}
                                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {googleLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
                            {authState === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthState("signup")}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthState("login")}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
