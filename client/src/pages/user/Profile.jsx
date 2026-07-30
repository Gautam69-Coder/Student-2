import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    Calendar,
    MapPin,
    LogOut,
    MessageSquare,
    Info,
    Lock,
    Eye,
    EyeOff,
    Save,
    Bookmark,
    FileText,
    TrendingUp,
    Star,
    Award,
    Key
} from "lucide-react";
import { userProfileUpdate, saveApiKey } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "@/Utils/customMessage";
import { DashboardLayout } from "@/components/layout/layout";
import { useData } from "@/context/DataContext";

export function Profile({ onLogout }) {
    const { user, setUser, notes } = useData();
    useTitle("Profile Settings");

    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userDetail, setUserDetail] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [userUpdate, setUserUpdate] = useState([]);

    const [apiKeyVal, setApiKeyVal] = useState("");
    const [isSavingKey, setIsSavingKey] = useState(false);
    const [apiKeyStatusError, setApiKeyStatusError] = useState("");

    const handleSaveKey = async (e) => {
        e.preventDefault();
        setApiKeyStatusError("");
        if (!apiKeyVal.trim()) {
            return customMessage({ content: "API key cannot be empty", type: "error" });
        }

        try {
            setIsSavingKey(true);
            const res = await saveApiKey({ apiKeyInput: apiKeyVal });
            if (res.status === 200 || res.data?.message) {
                customMessage({ content: "Groq API key connected successfully!", type: "success" });
                setApiKeyVal("");
                setUser(prev => ({
                    ...prev,
                    apiKey: "gsk_stored"
                }));
            }
        } catch (err) {
            console.error("API key save error:", err);
            setApiKeyStatusError(err.response?.data?.message || err.message || "Failed to save API key");
        } finally {
            setIsSavingKey(false);
        }
    };

    useEffect(() => {
        if (user) {
            setUserDetail({
                username: user.username || "",
                email: user.email || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [user]);

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-sm font-semibold text-slate-500">Failed to load profile details.</p>
                </div>
            </DashboardLayout>
        );
    }

    const handleChanged = (e) => {
        setUserDetail({ ...userDetail, [e.target.name]: e.target.value });
        if (!userUpdate.includes(e.target.name)) {
            setUserUpdate([...userUpdate, e.target.name]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userUpdate.length === 0) {
            return customMessage({ content: "No changes to update", type: "info" });
        }

        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (userDetail.email && !emailRegex.test(userDetail.email)) {
                return customMessage({ content: "Please enter a valid email address", type: "error" });
            }

            if (userDetail.email.length < 5 || userDetail.email.length > 254) {
                return customMessage({ content: "Email should be between 5 and 254 characters", type: "error" });
            }

            if (userDetail.password || userDetail.confirmPassword) {
                if (userDetail.password !== userDetail.confirmPassword) {
                    return customMessage({ content: "Passwords do not match", type: "error" });
                }
                if (userDetail.password.length < 6) {
                    return customMessage({ content: "Password must be at least 6 characters", type: "error" });
                }
            }

            setIsSaving(true);

            // get unique changed fields
            const uniqueFields = [...new Set(userUpdate)];

            // convert array to key-value pairs
            const updatePayload = Object.fromEntries(
                uniqueFields.map(key => [key, userDetail[key]])
            );

            // If passwords aren't set, remove them from payload
            if (!userDetail.password) {
                delete updatePayload.password;
                delete updatePayload.confirmPassword;
            }

            const updatedData = await userProfileUpdate(updatePayload);
            if (updatedData.data?.data?.type === "success" || updatedData.status === 200) {
                customMessage({ content: "Profile updated successfully!", type: "success" });
                
                // Update frontend state context
                const updatedUser = updatedData.data?.data?.user || updatedData.data?.user;
                if (updatedUser) {
                    setUser(prev => ({
                        ...prev,
                        ...updatedUser
                    }));
                }
                setUserUpdate([]);
                // Clear password fields
                setUserDetail(prev => ({ ...prev, password: "", confirmPassword: "" }));
            }
        } catch (error) {
            console.error(error);
            customMessage({ content: "Failed to update profile", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate dynamic stats
    const userNotesCount = notes?.filter(note => note.user === user._id || note.user?._id === user._id).length || 0;
    const bookmarksCount = user.bookmarks?.length || 0;
    const visitCount = user.visitCount || 1;

    // Determine Subscription Tier Badge
    const renderSubscriptionBadge = () => {
        const tier = user.subscription || "free";
        if (tier === "lifetime") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                    <Award size={12} className="fill-current" />
                    Lifetime Elite
                </span>
            );
        }
        if (tier === "pro") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50 shadow-xs">
                    <Star size={11} className="fill-current animate-spin-slow" />
                    Student Pro
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                Basic / Free
            </span>
        );
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-4 px-2 space-y-6">
                
                {/* Two-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column: Profile Card & Quick Actions */}
                    <div className="space-y-6 lg:col-span-1">
                        
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                            {/* Colorful Gradient Cover */}
                            <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative" />
                            
                            {/* Card Body */}
                            <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                                {/* Avatar (overhangs the banner) */}
                                <div className="-mt-12 mb-4 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-xl object-cover" />
                                    ) : (
                                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl uppercase">
                                            {user.username?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Username */}
                                <h2 className="text-xl font-extrabold text-slate-800 capitalize">
                                    {user.username}
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                    Student Hub Portal
                                </p>

                                {/* Subscription Badge */}
                                <div className="mt-3.5">
                                    {renderSubscriptionBadge()}
                                </div>

                                <hr className="w-full border-slate-100 my-5" />

                                {/* Info Rows */}
                                <div className="w-full space-y-3.5 text-left">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                        <Shield size={14} className="text-indigo-500 shrink-0" />
                                        <span className="truncate">Role: <strong className="text-slate-800 uppercase">{user.role || "user"}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                        <Calendar size={14} className="text-purple-500 shrink-0" />
                                        <span>Joined: <strong className="text-slate-800">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                                        <MapPin size={14} className="text-rose-500 shrink-0" />
                                        <span>Location: <strong className="text-slate-800">India</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Links */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2 px-1">
                                Quick Navigation
                            </h3>
                            <Link
                                to="/dashboard/feedback"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <MessageSquare size={14} />
                                </div>
                                <span className="flex-1">Send Feedback / Help Request</span>
                            </Link>

                            <Link
                                to="/dashboard/about-contact"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                                    <Info size={14} />
                                </div>
                                <span className="flex-1">About & Contact Us</span>
                            </Link>

                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50/50 text-xs font-bold text-rose-600 transition-all border border-transparent hover:border-rose-100 cursor-pointer text-left"
                            >
                                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                                    <LogOut size={14} />
                                </div>
                                <span className="flex-1">Sign Out Account</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Statistics & Edit Profile Form */}
                    <div className="space-y-6 lg:col-span-2">
                        
                        {/* Dynamic Academic Statistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900">{userNotesCount}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Notes Shared</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                                    <Bookmark size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900">{bookmarksCount}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bookmarks</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900">{visitCount}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Portal Visits</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-800">Account Credentials</h3>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage your personal information and login credentials.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="username"
                                                required
                                                value={userDetail.username}
                                                onChange={handleChanged}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={userDetail.email}
                                                onChange={handleChanged}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">New Password (Optional)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                value={userDetail.password}
                                                onChange={handleChanged}
                                                className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                                value={userDetail.confirmPassword}
                                                onChange={handleChanged}
                                                className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving || userUpdate.length === 0}
                                        className="h-11 px-6 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {isSaving ? (
                                            "Saving Changes..."
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* AI API Key Configuration */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mt-6">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                                <div>
                                    <h3 className="font-extrabold text-sm text-slate-800">AI Assistant Settings</h3>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Configure your API keys to enable Groq AI features.</p>
                                </div>
                                {user.apiKey ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Connected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Action Required
                                    </span>
                                )}
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Instructions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold mb-2">1</div>
                                        <p className="leading-relaxed">Go to the <a href="https://console.groq.com/" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">Groq Console</a> and create a free account.</p>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold mb-2">2</div>
                                        <p className="leading-relaxed">Generate a new API key and paste it in the field below to connect.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveKey} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Groq API Key</label>
                                        <div className="relative">
                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={apiKeyVal}
                                                onChange={(e) => setApiKeyVal(e.target.value)}
                                                placeholder={user.apiKey ? "••••••••••••••••••••••••••••••••" : "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 font-mono"
                                            />
                                        </div>
                                    </div>

                                    {apiKeyStatusError && (
                                        <p className="text-[10px] text-red-500 font-semibold bg-red-50 border border-red-100 p-2.5 rounded-xl">
                                            {apiKeyStatusError}
                                        </p>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSavingKey || !apiKeyVal.trim()}
                                            className="h-11 px-6 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                        >
                                            {isSavingKey ? (
                                                "Saving Key..."
                                            ) : (
                                                <>
                                                    <Save size={14} />
                                                    <span>{user.apiKey ? "Update API Key" : "Connect API Key"}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
