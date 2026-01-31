
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DotLoader } from "../../Utils/loaders"

import { GraduationCap, Shield, Eye, EyeOff, Mail, Lock, User, Sparkles, CloudCog } from "lucide-react"
import { registerUser, loginUser } from "@/Api/api"

const quotes = [
    { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
]

export function AuthSection({ authState, setAuthState, onAuth }) {
    const [role, setRole] = useState("user")
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [adminSecret, setAdminSecret] = useState("")
    const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const userData = {
                username: name,
                email,
                password,
                role,
                adminSecret
            }

            const loginData = {
                email,
                password
            }

            const res = authState === "login" ? await loginUser(loginData) : await registerUser(userData)
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            localStorage.setItem('isAuthenticated', 'true');

            if (res.data.user) {
                onAuth(res.data.user.role, res.data.user.username);
            }
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.msg || err.response?.data?.message || err.message || "An error occurred during authentication";
            setError(message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#FCFAF8]">
            {/* Left Side - Quote Section (Minimal Pattern) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white border-r border-[#E5E5E5]"
            >
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

                <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-12">
                            <div className="p-2 rounded-lg bg-slate-900">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                Student Hub
                            </span>
                        </div>

                        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-slate-900 mb-8 font-serif italic">
                            "{currentQuote.text}"
                        </blockquote>
                        <p className="text-base sm:text-lg text-slate-500 font-medium">— {currentQuote.author}</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Paper Card */}
                    <div className="bg-white rounded-xl p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5]">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                                {authState === "login" ? "Welcome Back" : "Create Account"}
                            </h1>
                            <p className="text-slate-500">
                                {authState === "login"
                                    ? "Enter your details to access your account"
                                    : "Start your learning journey today"}
                            </p>
                        </div>

                        {/* Role Toggle */}
                        <div className="flex gap-2 p-1.5 rounded-lg bg-slate-100 mb-8">
                            <button
                                onClick={() => setRole("student")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${role === "student"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Student
                            </button>
                            <button
                                onClick={() => setRole("admin")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${role === "admin"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {authState === "signup" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                            Full Name
                                        </label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-0 rounded-lg transition-all text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="student@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-0 rounded-lg transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative mt-2">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-11 pl-10 pr-10 bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-0 rounded-lg transition-all text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {authState === "signup" && role === "admin" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label htmlFor="adminSecret" className="text-sm font-medium text-slate-700">
                                            Admin Secret Key
                                        </label>
                                        <div className="relative mt-2">
                                            <CloudCog className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                id="adminSecret"
                                                type="password"
                                                placeholder="Enter admin secret"
                                                value={adminSecret}
                                                onChange={(e) => setAdminSecret(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-0 rounded-lg transition-all text-sm"
                                                required={role === "admin"}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {loading ? (
                                <div className="flex justify-center">
                                    <DotLoader size={20} />
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-lg font-medium transition-all"
                                >
                                    {authState === "login" ? "Sign In" : "Create Account"}
                                </button>
                            )
                            }
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 h-12 rounded-lg font-medium transition-all"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                                Google
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-8">
                            {authState === "login" ? (
                                <>
                                    {"Don't have an account? "}
                                    <button onClick={() => setAuthState("signup")} className="text-slate-900 font-semibold hover:underline">
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button onClick={() => setAuthState("login")} className="text-slate-900 font-semibold hover:underline">
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div >
        </div >
    )
}
