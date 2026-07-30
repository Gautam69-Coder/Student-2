import React, { useEffect, useState, useMemo } from "react";
import { Heart, MessageSquare, Users, Send, Loader2, Info, Share2, Search, Check, Code2, Sparkles } from "lucide-react";
import { fetchCommunityPosts, createCommunityPost, toggleCommunityLike, getMe } from "@/Api/api";
import { SEO } from "@/components/common/SEO";
import { DashboardLayout } from "@/components/layout/layout";
import { theme } from "@/lib/theme";

export function Community({ requireAuth }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [copiedPostId, setCopiedPostId] = useState(null);

    useEffect(() => {
        getMe()
            .then((res) => {
                setCurrentUserId(res.data._id || res.data.id);
                setCurrentUsername(res.data.username);
            })
            .catch(() => setCurrentUserId(null));
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetchCommunityPosts(1, 40);
                setPosts(res.data.data.posts || []);
            } catch (err) {
                setError("Unable to load community posts right now. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        requireAuth(async () => {
            if (!content.trim()) {
                setError("Share something with the community first.");
                return;
            }
            setCreating(true);
            setError("");
            try {
                const res = await createCommunityPost({
                    title: title.trim() || undefined,
                    content: content.trim(),
                    username: currentUsername,
                });
                setPosts((prev) => [res.data.data, ...prev]);
                setContent("");
                setTitle("");
            } catch (err) {
                setError(err.response?.data?.msg || "Could not share your post. Try again.");
            } finally {
                setCreating(false);
            }
        });
    };

    const handleLike = async (postId) => {
        requireAuth(async () => {
            try {
                const res = await toggleCommunityLike(postId);
                setPosts((prev) =>
                    prev.map((p) =>
                        p._id === postId
                            ? { ...p, likedBy: res.data.likedBy, likesCount: res.data.likesCount }
                            : p
                    )
                );
            } catch {
                // Non-blocking – ignore like failures silently
            }
        });
    };

    const handleShare = (post) => {
        const textToCopy = `${post.title ? post.title + "\n\n" : ""}${post.content}\n\n- Shared from Student Community by @${post.username}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopiedPostId(post._id);
                setTimeout(() => setCopiedPostId(null), 2000);
            })
            .catch(() => {});
    };

    const getAvatarColors = (username) => {
        if (!username) return { bg: "from-slate-400 to-slate-500", text: "text-white" };
        const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            "from-rose-500 to-pink-500",
            "from-indigo-500 to-purple-500",
            "from-blue-500 to-cyan-500",
            "from-emerald-500 to-teal-500",
            "from-amber-500 to-orange-500",
            "from-violet-500 to-fuchsia-500",
            "from-sky-500 to-indigo-600",
        ];
        return { bg: gradients[hash % gradients.length], text: "text-white" };
    };

    const formatDate = (date) => {
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return "";
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredAndEnrichedPosts = useMemo(() => {
        let list = posts;

        // Active Tab Filter
        if (activeTab === "mine" && currentUsername) {
            list = list.filter(p => p.username?.toLowerCase() === currentUsername.toLowerCase());
        } else if (activeTab === "liked" && currentUserId) {
            list = list.filter(p => (p.likedBy || []).some(id => id === currentUserId || id?._id === currentUserId));
        }

        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(p => 
                p.title?.toLowerCase().includes(query) ||
                p.content?.toLowerCase().includes(query) ||
                p.username?.toLowerCase().includes(query)
            );
        }

        return list.map((p) => ({
            ...p,
            likesCount: typeof p.likesCount === "number" ? p.likesCount : (p.likedBy || []).length,
            isLiked: currentUserId ? (p.likedBy || []).some((id) => id === currentUserId || id?._id === currentUserId) : false,
        }));
    }, [posts, activeTab, searchQuery, currentUserId, currentUsername]);

    return (
        <DashboardLayout>
            <SEO
                title="Student Community — Ask & Share | Student Hub"
                description="Join the Mumbai IT student community. Ask questions about notes, share MERN stack tips, and connect with other students in India."
                url="/dashboard/community"
            />
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Modern Banner/Header */}
                <div
                    className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white"
                >
                    {/* Decorative subtle background shape */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Space</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                Share, Ask & Help <Sparkles size={20} className="text-indigo-500 animate-pulse" />
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 max-w-xl">
                                Welcome to the hub! Post quick questions about coursework, share helpful notes, and interact with peers. Let's grow together.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Feed & Creation */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Composer Form */}
                        <form
                            onSubmit={handleCreate}
                            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-sm transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                {currentUsername ? (
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColors(currentUsername).bg} flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0`}>
                                        {currentUsername.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                                        <Users size={18} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800">
                                        {currentUsername ? `@${currentUsername}` : "Start a discussion"}
                                    </h3>
                                    <p className="text-xs text-slate-400">Share doubts, notes updates, or tips</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={120}
                                    placeholder="Topic/Title (optional)"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={2000}
                                    rows={3}
                                    placeholder="Write details about your doubt, MERN tips, or college updates..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder-slate-400 resize-none focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 leading-relaxed"
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-2.5 rounded-xl flex items-center gap-2">
                                    <Info size={14} />
                                    {error}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    {content.length}/2000 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-50"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            Share with community
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Interactive Filter Control Bar */}
                        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === "all"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    All Feed
                                </button>
                                <button
                                    onClick={() => setActiveTab("mine")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === "mine"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    My Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab("liked")}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === "liked"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    Liked
                                </button>
                            </div>

                            <div className="relative flex-1 sm:max-w-xs">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search posts or authors..."
                                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 px-1.5 py-0.5 rounded font-bold transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Feed List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="rounded-2xl p-8 bg-white border border-slate-200 flex items-center justify-center">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Loader2 size={20} className="animate-spin text-indigo-600" />
                                        <span className="text-sm font-semibold">Loading community posts...</span>
                                    </div>
                                </div>
                            ) : filteredAndEnrichedPosts.length === 0 ? (
                                <div className="rounded-2xl p-10 bg-white border border-slate-200 text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                                        <MessageSquare size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">No posts found</p>
                                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                        {searchQuery ? "No matches for your search. Try different keywords!" : "Be the first to start a discussion!"}
                                    </p>
                                </div>
                            ) : (
                                filteredAndEnrichedPosts.map((post) => (
                                    <article
                                        key={post._id}
                                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all duration-300"
                                    >
                                        {/* Author Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColors(post.username).bg} flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0`}>
                                                    {post.username?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-800">
                                                        @{post.username?.toLowerCase()}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                                                        {formatDate(post.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            {post.username?.toLowerCase() === currentUsername?.toLowerCase() && (
                                                <span className="text-[9px] font-extrabold bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">
                                                    You
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="mt-4">
                                            {post.title && (
                                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                                                    {post.title}
                                                </h2>
                                            )}
                                            <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                                                {post.content}
                                            </p>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => handleLike(post._id)}
                                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                                                    post.isLiked
                                                        ? "bg-rose-50 text-rose-600 border-rose-200 shadow-xs"
                                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                                                }`}
                                            >
                                                <Heart size={13} className={post.isLiked ? "fill-current text-rose-500 animate-pulse" : ""} />
                                                <span>{post.likesCount || 0}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleShare(post)}
                                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all active:scale-95 ml-auto ${
                                                    copiedPostId === post._id
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                                                }`}
                                            >
                                                {copiedPostId === post._id ? (
                                                    <>
                                                        <Check size={13} />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 size={13} />
                                                        <span>Share</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Guidelines Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-sm pb-3 border-b border-slate-100">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                    <Users size={16} />
                                </div>
                                <span>About The Community</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                This space is dedicated to Mumbai IT students. Ask queries about practical sheets, lecture notes, coding practice problems, or coordinate study groups!
                            </p>
                            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3.5 text-amber-800 text-[11px] leading-relaxed flex gap-2">
                                <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
                                <span>Please keep conversations academic, supportive, and clean. Admins actively moderate all reports.</span>
                            </div>
                        </div>

                        {/* Tech Stacks / Tags Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-sm pb-3 border-b border-slate-100">
                                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                                    <Code2 size={16} />
                                </div>
                                <span>Popular Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {["#MERN", "#React", "#ExpressJS", "#MongoDB", "#NodeJS", "#DataStructures", "#ExamTips", "#MumbaiUniversity", "#VivaQuestions", "#Practicals"].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-[11px] font-bold bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
