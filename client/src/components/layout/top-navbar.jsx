import React, { useState } from "react";
import { Bell, ChevronDown, Search, X } from "lucide-react";
import { theme } from "@/lib/theme";
import { useNavigate } from "react-router-dom";

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

    const navigate= useNavigate();

    return (
        <div
            className="flex   items-center justify-between px-6 py-4 border-b shadow-sm"
            style={{
                background: theme.colors.white,
                borderColor: theme.colors.lightGray,
            }}
        >
            {/* Profile Dropdown - Left */}
            <div className="relative">
                <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
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
                                onClick={()=>{
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
                                onClick={()=>{onLogout()}}
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-sm mx-6">
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
            <div className="flex items-center gap-3">
                <div className="relative">
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
