import React, { useEffect, useState } from "react";
import { Bell, ChevronDown, Search, Shield } from "lucide-react";
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
            console.log(apiKeyInput);
            res = await saveApiKey({ apiKeyInput });
            setShowAddKeyModal(false);
            if (res.data.message) {
                return customMessage({
                    type: "success",
                    content: `${res.data.message} !`
                });
            }
        } catch (e) {
            // setApiKeyError(e?.response?.data?.error || e?.message || "Failed to save API key");
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
                <div className="relative">

                    {showAddKeyModal && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowAddKeyModal(false)}
                            />
                            <div
                                className="absolute right-0 top-full mt-2 z-30 w-[28rem] max-w-[90vw] rounded-2xl shadow-2xl overflow-hidden"
                                style={{
                                    background: theme.colors.white,
                                    border: `1px solid ${theme.colors.lightGray}`,
                                }}
                            >
                                <div
                                    className="px-5 py-4 border-b"
                                    style={{
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <div className="text-sm font-semibold" style={{ color: theme.colors.dark }}>
                                        Add Groq API Key
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: theme.colors.darkGray, lineHeight: 1.4 }}>
                                        Follow these steps to connect your Groq API key.
                                    </div>
                                </div>

                                <div className="px-5 py-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <ol className="list-decimal pl-5 space-y-2" style={{ color: theme.colors.darkGray, fontSize: 13 }}>
                                        <li>Go to <b>https://console.groq.com/</b></li>
                                        <li>Create an API key (or open API keys from your dashboard).</li>
                                        <li>Copy the API key.</li>
                                        <li>Paste it below and click <b>Save</b>.</li>
                                    </ol>

                                    <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: `1px solid rgba(34,197,94,0.15)` }}>
                                        <div className="text-xs" style={{ color: theme.colors.darkGray }}>
                                            Tip: Keep your API key private. Do not share it.
                                        </div>
                                    </div>

                                    {apiKeyError && (
                                        <div className="mt-4 text-xs rounded-xl px-3 py-2" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
                                            {apiKeyError}
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-4 border-t flex items-center gap-3" style={{ borderColor: theme.colors.lightGray }}>
                                    <input
                                        type="password"
                                        name="apiKey"
                                        value={apiKeyInput}
                                        onChange={(e) => setApiKeyInput(e.target.value)}
                                        placeholder="Paste Groq API key"
                                        className="flex-1 h-10 px-3 rounded-xl bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        style={{ color: theme.colors.dark }}
                                    />
                                    <button
                                        onClick={handleSaveApiKey}
                                        disabled={savingApiKey}
                                        className="h-10 px-4 rounded-xl font-semibold text-sm transition-all"
                                        style={{
                                            background: savingApiKey ? theme.colors.softGray : theme.colors.lime,
                                            color: theme.colors.dark,
                                            opacity: savingApiKey ? 0.7 : 1,
                                        }}
                                    >
                                        {savingApiKey ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <button
                        onClick={() => setShowAddKeyModal(true)}
                        className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-all border"
                        style={{
                            background: "transparent",
                            borderColor: theme.colors.lightGray,
                            color: theme.colors.dark,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Add AI Key
                    </button>

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
