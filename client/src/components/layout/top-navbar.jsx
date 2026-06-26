import React, { useEffect, useState } from "react";
import { Bell, ChevronDown, Search, Shield, Key } from "lucide-react";
import { theme } from "@/lib/theme";
import { useNavigate } from "react-router-dom";
import { saveApiKey } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";

export function TopNavBar({
    userName,
    userEmail,
    userAvatar,
    searchQuery,
    setSearchQuery,
    isBell,
    setisBell,
    Notification,
    onLogout
}) {
    const [showProfile, setShowProfile] = useState(false);
    const [showAddKeyModal, setShowAddKeyModal] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [savingApiKey, setSavingApiKey] = useState(false);
    const [apiKeyError, setApiKeyError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!showAddKeyModal) {
            setApiKeyInput("");
            setApiKeyError("");
            setSavingApiKey(false);
        }
    }, [showAddKeyModal]);
    const handleSaveApiKey = async () => {
        setSavingApiKey(true);
        setApiKeyError("");
        try {
            const res = await saveApiKey({ apiKeyInput });
            if (res.data.message) {
                localStorage.setItem("isApiKey","false")
                return customMessage({
                    type: "success",
                    content: `${res.data.message} !`
                });
            }
        } catch (e) {
            setApiKeyError(e?.response?.data?.error || e?.message || "Failed to save API key");
            console.log(e);
        } finally {
            setSavingApiKey(false);
        }
    };

    return (
        <div
            className="flex   items-center justify-between sm:px-6 px-2 py-4 border-b shadow-sm"
            style={{
                background: theme.colors.white,
                borderColor: theme.colors.lightGray,
            }}
        >
            {/* Profile Dropdown - Left */}
            <div className="relative">
                <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-3 sm:px-3 px-1 sm:py-2 rounded-lg hover:bg-slate-100 transition-all"
                    style={{ background: "transparent" }}
                >
                    {userAvatar && (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="w-8 h-8 rounded-lg"
                        />
                    )}
                    <div className="text-left hidden sm:block">
                        <div className="text-sm font-semibold" style={{ color: theme.colors.dark }}>
                            {userName}
                        </div>
                        <div className="text-xs" style={{ color: theme.colors.darkGray }}>
                            {userEmail}
                        </div>
                    </div>
                    <ChevronDown
                        size={16}
                        style={{ color: theme.colors.darkGray }}
                        className={`transition-transform ${showProfile ? "rotate-180" : ""}`}
                    />
                </button>

                {showProfile && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowProfile(false)}
                        />
                        <div
                            className="absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg z-20 py-2"
                            style={{
                                background: theme.colors.white,
                                border: `1px solid ${theme.colors.lightGray}`,
                            }}
                        >
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors"
                                style={{ color: theme.colors.dark }}
                                onClick={() => {
                                    navigate("/dashboard/profile")
                                }}
                            >
                                View Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors"
                                style={{ color: theme.colors.dark }}
                            >
                                Settings
                            </button>
                            <div
                                style={{ borderColor: theme.colors.lightGray }}
                                className="h-px my-1 border-t"
                            />
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-500"
                                onClick={() => { onLogout() }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Search Bar - Center */}
            <div className="flex-1 sm:mx-6 mx-2 shadow-2xl ">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: theme.colors.darkGray }}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        name="search"
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                        className="w-full h-9 pl-10 pr-4 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                        style={{
                            color: theme.colors.dark,
                        }}
                    />
                </div>
            </div>

            {/* Notification Bell - Right */}
            <div className="flex items-center  gap-3">
                <div className="relative flex">

                    {showAddKeyModal && (
                        <>
                            {/* Animated Backdrop */}
                            <div
                                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all duration-300"
                                onClick={() => setShowAddKeyModal(false)}
                            />

                            {/* Modal Container */}
                            <div
                                className="absolute right-0 top-full mt-4 z-50 w-[32rem] max-w-[95vw] rounded-3xl shadow-2xl overflow-hidden origin-top-right transform transition-all duration-300 scale-100 opacity-100"
                                style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(16px)",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                }}
                            >
                                {/* Header with Gradient Background */}
                                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
                                            <Key size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Connect Groq API</h3>
                                            <p className="text-sm text-slate-500 font-medium">Power your AI experience with lightning-fast inference.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="px-6 py-5" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <div className="space-y-4">
                                        {/* Instruction Steps - Modern Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mb-2">1</div>
                                                <p className="text-sm text-slate-600">Go to the <a href="https://console.groq.com/" target="_blank" rel="noreferrer" className="text-emerald-600 font-semibold hover:underline">Groq Console</a>.</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mb-2">2</div>
                                                <p className="text-sm text-slate-600">Generate a new API key.</p>
                                            </div>
                                        </div>

                                        {/* Security Tip */}
                                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                                            <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-emerald-800">Secure Storage</h4>
                                                <p className="text-xs text-emerald-600 mt-0.5">Your key is encrypted locally. Never share your API key with anyone.</p>
                                            </div>
                                        </div>

                                        {/* Error State */}
                                        {apiKeyError && (
                                            <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                {apiKeyError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Input and Action Footer */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <div className="relative flex-1 w-full">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Key className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="password"
                                                name="apiKey"
                                                value={apiKeyInput}
                                                onChange={(e) => setApiKeyInput(e.target.value)}
                                                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                                                className="block w-full pl-10 pr-3 py-3 border text-black border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm font-mono"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveApiKey}
                                            disabled={savingApiKey || !apiKeyInput.trim()}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                            style={{
                                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)"
                                            }}
                                        >
                                            <span className="relative z-10">{savingApiKey ? 'Connecting...' : 'Connect Key'}</span>
                                            {!savingApiKey && <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Enhanced Add Key Button */}
                    {!localStorage.getItem("isApiKey") && (
                        <button
                            onClick={() => setShowAddKeyModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
                            style={{
                                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                                color: "white",
                                fontSize: 13,
                                fontWeight: 600,
                                border: "1px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 4px 14px 0 rgba(15, 23, 42, 0.4)"
                            }}
                        >
                            {/* <div className=" w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" /> */}
                            <Key size={15} className="text-emerald-400" />
                            <span className="tracking-wide">Add AI Key</span>
                        </button>

                    )}

                    <div>
                        <button
                            onClick={() => setisBell?.(!isBell)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-all relative"
                            style={{
                                background: isBell ? "rgba(204, 255, 0, 0.1)" : "transparent",
                                color: isBell ? theme.colors.lime : theme.colors.dark,
                            }}
                        >
                            <Bell size={20} />
                            <span
                                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                                style={{ background: theme.colors.lime }}
                            />
                        </button>

                        <button className="text-black mx-5 shadow-lg border border-yellow-100 bg-white p-2 rounded-2xl"
                            onClick={() => {
                                navigate("/admin")
                            }}
                        >
                            <Shield size={20} />
                        </button>
                    </div>

                    {isBell && Notification && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setisBell?.(false)}
                            />
                            <div
                                className="absolute right-0 top-full mt-2 w-96 rounded-lg shadow-2xl z-20 max-h-96 overflow-y-auto"
                                style={{
                                    background: theme.colors.white,
                                    border: `1px solid ${theme.colors.lightGray}`,
                                }}
                            >
                                <Notification />
                            </div>
                        </>
                    )}



                </div>
            </div>
        </div>
    );
}
