import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Shield,
    Calendar,
    MapPin,
    LogOut,
    MessageSquare,
    Lock,
    Eye,
    EyeOff,
    Save,
    Bookmark,
    FileText,
    TrendingUp,
    Star,
    Award,
    Key,
} from "lucide-react";
import { userProfileUpdate, saveApiKey } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "@/Utils/customMessage";
import { DashboardLayout } from "@/components/layout/layout";
import { useData } from "@/context/DataContext";

export function Profile({ onLogout }) {
    const { user, setUser, notes = [] } = useData();
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
                setUser((prev) => ({
                    ...prev,
                    apiKey: "gsk_stored",
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
                    <p className="text-sm font-semibold text-muted-foreground">Failed to load profile details.</p>
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

            const uniqueFields = [...new Set(userUpdate)];
            const updatePayload = Object.fromEntries(uniqueFields.map((key) => [key, userDetail[key]]));

            if (!userDetail.password) {
                delete updatePayload.password;
                delete updatePayload.confirmPassword;
            }

            const updatedData = await userProfileUpdate(updatePayload);
            if (updatedData.data?.data?.type === "success" || updatedData.status === 200) {
                customMessage({ content: "Profile updated successfully!", type: "success" });

                const updatedUser = updatedData.data?.data?.user || updatedData.data?.user;
                if (updatedUser) {
                    setUser((prev) => ({
                        ...prev,
                        ...updatedUser,
                    }));
                }
                setUserUpdate([]);
                setUserDetail((prev) => ({ ...prev, password: "", confirmPassword: "" }));
            }
        } catch (error) {
            console.error(error);
            customMessage({ content: "Failed to update profile", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const userNotesCount = Array.isArray(notes)
        ? notes.filter((note) => note.user === user?._id || note.user?._id === user?._id).length
        : user?.notesCount || 0;
    const bookmarksCount = user?.bookmarks?.length || 0;
    const visitCount = user?.visitCount || 1;

    const renderSubscriptionBadge = () => {
        const tier = user?.subscription || "free";
        if (tier === "lifetime") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                    <Award size={12} aria-hidden="true" />
                    Lifetime Elite
                </span>
            );
        }
        if (tier === "pro") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                    <Star size={11} aria-hidden="true" />
                    Student Pro
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                Standard Member
            </span>
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Profile Card */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="surface-card rounded-3xl overflow-hidden">
                            <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 relative" />

                            <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                                <div className="-mt-12 mb-4 p-1 bg-card rounded-2xl border border-border shadow-sm shrink-0">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-20 h-20 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-indigo-500/10 text-primary rounded-xl flex items-center justify-center font-extrabold text-2xl uppercase">
                                            {user.username?.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-xl font-extrabold text-foreground capitalize">
                                    {user.username}
                                </h1>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                                    Student Hub Workspace
                                </p>

                                <div className="mt-3.5">{renderSubscriptionBadge()}</div>

                                <hr className="w-full border-border my-5" />

                                <div className="w-full space-y-3 text-left">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                        <Shield size={14} className="text-primary shrink-0" aria-hidden="true" />
                                        <span className="truncate">
                                            Role: <strong className="text-foreground uppercase">{user.role || "user"}</strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                        <Calendar size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                                        <span>
                                            Joined:{" "}
                                            <strong className="text-foreground">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          year: "numeric",
                                                      })
                                                    : "N/A"}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                        <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                                        <span>
                                            Region: <strong className="text-foreground">India</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="surface-card rounded-3xl p-5 space-y-2.5">
                            <h2 className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider px-1 mb-2">
                                Quick Navigation
                            </h2>
                            <Link
                                to="/dashboard/feedback"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary text-xs font-bold text-foreground transition-colors"
                            >
                                <div className="p-1.5 bg-indigo-500/10 text-primary rounded-lg shrink-0">
                                    <MessageSquare size={14} aria-hidden="true" />
                                </div>
                                <span>Send Feedback / Support</span>
                            </Link>

                            <button
                                type="button"
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-xs font-bold text-destructive transition-colors text-left"
                            >
                                <div className="p-1.5 bg-destructive/10 text-destructive rounded-lg shrink-0">
                                    <LogOut size={14} aria-hidden="true" />
                                </div>
                                <span>Sign Out Account</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: "Notes Shared", val: userNotesCount, icon: FileText, cls: "bg-indigo-500/10 text-primary border-indigo-500/20" },
                                { label: "Bookmarks", val: bookmarksCount, icon: Bookmark, cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
                                { label: "Portal Visits", val: visitCount, icon: TrendingUp, cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
                            ].map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.label} className="surface-card p-5 rounded-2xl flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${s.cls}`}>
                                            <Icon size={18} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-extrabold text-foreground tabular-nums">{s.val}</p>
                                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                                                {s.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Credentials Form */}
                        <div className="surface-card rounded-3xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-border bg-secondary/40">
                                <h2 className="font-bold text-base text-foreground">Account Credentials</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Update your profile information and password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="profile-username" className="text-xs font-bold text-foreground">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="profile-username"
                                                type="text"
                                                name="username"
                                                required
                                                value={userDetail.username}
                                                onChange={handleChanged}
                                                className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-ring outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="profile-email" className="text-xs font-bold text-foreground">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="profile-email"
                                                type="email"
                                                name="email"
                                                required
                                                value={userDetail.email}
                                                onChange={handleChanged}
                                                className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-ring outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="profile-password" className="text-xs font-bold text-foreground">
                                            New Password (Optional)
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="profile-password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                                value={userDetail.password}
                                                onChange={handleChanged}
                                                className="w-full min-h-[44px] pl-10 pr-11 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-ring outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="profile-confirm" className="text-xs font-bold text-foreground">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="profile-confirm"
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                                value={userDetail.confirmPassword}
                                                onChange={handleChanged}
                                                className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-ring outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving || userUpdate.length === 0}
                                        className="min-h-[42px] px-6 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-sm shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={14} aria-hidden="true" />
                                        <span>{isSaving ? "Saving Changes..." : "Save Changes"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* AI API Key Configuration */}
                        <div className="surface-card rounded-3xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-secondary/40">
                                <div>
                                    <h2 className="font-bold text-base text-foreground">AI Assistant Settings</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Configure your Groq API key to enable AI features.
                                    </p>
                                </div>
                                {user.apiKey ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Connected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Action Required
                                    </span>
                                )}
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-primary flex items-center justify-center text-[11px] font-bold mb-2">
                                            1
                                        </div>
                                        <p className="leading-relaxed">
                                            Go to the{" "}
                                            <a
                                                href="https://console.groq.com/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary font-bold hover:underline"
                                            >
                                                Groq Console
                                            </a>{" "}
                                            and create a free API key.
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[11px] font-bold mb-2">
                                            2
                                        </div>
                                        <p className="leading-relaxed">
                                            Paste your API key below to unlock AI explanations and code reviews.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveKey} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="groq-key" className="text-xs font-bold text-foreground">
                                            Groq API Key
                                        </label>
                                        <div className="relative">
                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                            <input
                                                id="groq-key"
                                                type="password"
                                                required
                                                value={apiKeyVal}
                                                onChange={(e) => setApiKeyVal(e.target.value)}
                                                placeholder={user.apiKey ? "••••••••••••••••••••••••••••••••" : "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
                                                className="w-full min-h-[44px] pl-10 pr-4 bg-background border border-input rounded-xl text-xs font-mono text-foreground focus:ring-2 focus:ring-ring outline-none"
                                            />
                                        </div>
                                    </div>

                                    {apiKeyStatusError && (
                                        <p className="text-xs text-destructive font-semibold bg-destructive/10 border border-destructive/25 p-3 rounded-xl">
                                            {apiKeyStatusError}
                                        </p>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSavingKey || !apiKeyVal.trim()}
                                            className="min-h-[42px] px-6 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Save size={14} aria-hidden="true" />
                                            <span>
                                                {isSavingKey
                                                    ? "Saving Key..."
                                                    : user.apiKey
                                                    ? "Update API Key"
                                                    : "Connect API Key"}
                                            </span>
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
