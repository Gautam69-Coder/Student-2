import React, { useEffect, useState, useMemo } from "react";
import { Heart, MessageSquare, Users, Send, Loader2, Info, Share2, Search, Check, Code2, Sparkles } from "lucide-react";
import { fetchCommunityPosts, createCommunityPost, toggleCommunityLike, getMe } from "@/Api/api";
import { SEO } from "@/components/common/SEO";
import { DashboardLayout } from "@/components/layout/layout";
import { formatTimeAgo } from "@/Utils/date";
import { copyToClipboard } from "@/Utils/clipboard";

export function Community() {
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
    };

    const handleLike = async (postId) => {
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
            // Non-blocking
        }
    };

    const handleShare = async (post) => {
        const textToCopy = `${post.title ? post.title + "\n\n" : ""}${post.content}\n\n- Shared from Student Community by @${post.username}`;
        const success = await copyToClipboard(textToCopy);
        if (success) {
            setCopiedPostId(post._id);
            setTimeout(() => setCopiedPostId(null), 2000);
        }
    };

    const getAvatarColors = (username) => {
        if (!username) return "from-slate-500 to-slate-600";
        const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            "from-indigo-500 to-violet-500",
            "from-emerald-500 to-teal-500",
            "from-sky-500 to-indigo-600",
            "from-amber-500 to-orange-500",
            "from-rose-500 to-pink-500",
        ];
        return gradients[hash % gradients.length];
    };

    const filteredAndEnrichedPosts = useMemo(() => {
        let list = posts;

        if (activeTab === "mine" && currentUsername) {
            list = list.filter((p) => p.username?.toLowerCase() === currentUsername.toLowerCase());
        } else if (activeTab === "liked" && currentUserId) {
            list = list.filter((p) =>
                (p.likedBy || []).some((id) => id === currentUserId || id?._id === currentUserId)
            );
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            list = list.filter(
                (p) =>
                    p.title?.toLowerCase().includes(query) ||
                    p.content?.toLowerCase().includes(query) ||
                    p.username?.toLowerCase().includes(query)
            );
        }

        return list.map((p) => ({
            ...p,
            likesCount: typeof p.likesCount === "number" ? p.likesCount : (p.likedBy || []).length,
            isLiked: currentUserId
                ? (p.likedBy || []).some((id) => id === currentUserId || id?._id === currentUserId)
                : false,
        }));
    }, [posts, activeTab, searchQuery, currentUserId, currentUsername]);

    return (
        <DashboardLayout>
            <SEO
                title="Student Community — Ask & Share | Student Hub"
                description="Join the student community. Ask questions about notes, share tips, and connect with peers."
                url="/dashboard/community"
            />
            <div className="space-y-6">
                {/* Header */}
                <div className="surface-card rounded-3xl p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Student Space
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        Share, Ask & Help
                        <Sparkles size={20} className="text-primary" aria-hidden="true" />
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2 max-w-2xl leading-relaxed">
                        Post questions about coursework, share helpful notes, and collaborate with peers across your cohort.
                    </p>
                </div>

                {/* Two-Column Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Composer */}
                        <form onSubmit={handleCreate} className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                {currentUsername ? (
                                    <div
                                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColors(
                                            currentUsername
                                        )} flex items-center justify-center font-bold text-sm text-white shrink-0`}
                                    >
                                        {currentUsername.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                                        <Users size={18} aria-hidden="true" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-bold text-sm text-foreground">
                                        {currentUsername ? `@${currentUsername}` : "Start a discussion"}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Share doubts, notes updates, or tips
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={120}
                                    aria-label="Discussion topic"
                                    placeholder="Topic / Title (optional)"
                                    className="w-full min-h-[44px] px-4 rounded-xl border border-input bg-background text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={2000}
                                    rows={3}
                                    aria-label="Discussion content"
                                    placeholder="Write details about your doubt, coding tips, or exam updates..."
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors leading-relaxed"
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-destructive font-semibold bg-destructive/10 border border-destructive/25 p-3 rounded-xl flex items-center gap-2">
                                    <Info size={14} aria-hidden="true" />
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                                <span className="text-[11px] font-bold font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border tabular-nums">
                                    {content.length}/2000 chars
                                </span>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="inline-flex items-center gap-2 px-5 min-h-[42px] rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-indigo-500/20 disabled:opacity-50"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} aria-hidden="true" />
                                            Share with community
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Filter Bar */}
                        <div className="surface-card p-2.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
                                {[
                                    { id: "all", label: "All Feed" },
                                    { id: "mine", label: "My Posts" },
                                    { id: "liked", label: "Liked" },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setActiveTab(t.id)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            activeTab === t.id
                                                ? "bg-card text-primary shadow-xs"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative flex-1 sm:max-w-xs">
                                <Search
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                    aria-hidden="true"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search posts"
                                    placeholder="Search posts or authors..."
                                    className="w-full min-h-[38px] pl-9 pr-14 rounded-xl bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-secondary hover:bg-muted text-foreground px-2 py-0.5 rounded-md font-bold"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="surface-card rounded-2xl p-10 flex items-center justify-center gap-3 text-muted-foreground">
                                    <Loader2 size={18} className="animate-spin text-primary" aria-hidden="true" />
                                    <span className="text-sm font-semibold">Loading community posts...</span>
                                </div>
                            ) : filteredAndEnrichedPosts.length === 0 ? (
                                <div className="surface-card rounded-2xl p-12 text-center space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
                                        <MessageSquare size={20} aria-hidden="true" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground">No posts found</p>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        {searchQuery
                                            ? "No matches for your search. Try different keywords!"
                                            : "Be the first to start a discussion!"}
                                    </p>
                                </div>
                            ) : (
                                filteredAndEnrichedPosts.map((post) => (
                                    <article key={post._id} className="surface-card rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColors(
                                                        post.username
                                                    )} flex items-center justify-center font-bold text-xs text-white shrink-0`}
                                                >
                                                    {post.username?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">
                                                        @{post.username?.toLowerCase()}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground tabular-nums">
                                                        {formatTimeAgo(post.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            {post.username?.toLowerCase() === currentUsername?.toLowerCase() && (
                                                <span className="text-[10px] font-bold bg-indigo-500/12 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full uppercase">
                                                    You
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            {post.title && (
                                                <h3 className="text-base font-bold text-foreground leading-snug">
                                                    {post.title}
                                                </h3>
                                            )}
                                            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                                                {post.content}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                                            <button
                                                type="button"
                                                onClick={() => handleLike(post._id)}
                                                className={`inline-flex items-center gap-2 px-3.5 min-h-[36px] rounded-full text-xs font-bold border transition-all active:scale-95 tabular-nums ${
                                                    post.isLiked
                                                        ? "bg-rose-500/12 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                                }`}
                                            >
                                                <Heart size={13} className={post.isLiked ? "fill-current" : ""} aria-hidden="true" />
                                                <span>{post.likesCount || 0}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleShare(post)}
                                                className={`inline-flex items-center gap-2 px-3.5 min-h-[36px] rounded-full text-xs font-bold border transition-all active:scale-95 ml-auto ${
                                                    copiedPostId === post._id
                                                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                                }`}
                                            >
                                                {copiedPostId === post._id ? (
                                                    <>
                                                        <Check size={13} aria-hidden="true" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Share2 size={13} aria-hidden="true" />
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

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="surface-card rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2.5 text-foreground font-bold text-sm pb-3 border-b border-border">
                                <div className="p-2 rounded-xl bg-indigo-500/10 text-primary shrink-0">
                                    <Users size={16} aria-hidden="true" />
                                </div>
                                <span>About The Community</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ask questions about practical sheets, lecture notes, coding tracks, or coordinate study groups with fellow students.
                            </p>
                            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3.5 text-amber-800 dark:text-amber-200 text-xs leading-relaxed flex gap-2">
                                <Info size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
                                <span>Keep discussions helpful, respectful, and focused on learning.</span>
                            </div>
                        </div>

                        <div className="surface-card rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2.5 text-foreground font-bold text-sm pb-3 border-b border-border">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <Code2 size={16} aria-hidden="true" />
                                </div>
                                <span>Popular Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    "#MERN",
                                    "#React",
                                    "#ExpressJS",
                                    "#MongoDB",
                                    "#NodeJS",
                                    "#DataStructures",
                                    "#ExamTips",
                                    "#VivaQuestions",
                                    "#Practicals",
                                ].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-[11px] font-bold bg-background hover:bg-indigo-500/10 border border-border hover:border-primary/40 text-muted-foreground hover:text-primary px-2.5 py-1.5 rounded-lg transition-colors"
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
