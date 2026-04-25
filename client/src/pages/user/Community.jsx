import React, { useEffect, useState, useMemo } from "react";
import { Heart, MessageSquare, Users, Send, Loader2 } from "lucide-react";
import { fetchCommunityPosts, createCommunityPost, toggleCommunityLike, getMe } from "@/Api/api";
import { useSocket } from "@/context/SocketContext";
import { SEO } from "@/components/common/SEO";

export function Community({ requireAuth }) {
    const { onlineUsers } = useSocket();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);

    useEffect(() => {
        getMe()
            .then((res) => { setCurrentUserId(res.data._id || res.data.id); setCurrentUsername(res.data.username) })
            .catch(() => setCurrentUserId(null));
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetchCommunityPosts(1, 30);
                setPosts(res.data.posts || []);
            } catch (err) {
                setError("Unable to load community right now. Please try again.");
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
                setPosts((prev) => [res.data, ...prev]);
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

    const formatDate = (date) => {
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const enrichedPosts = useMemo(
        () =>
            posts.map((p) => ({
                ...p,
                likesCount: typeof p.likesCount === "number" ? p.likesCount : (p.likedBy || []).length,
                isLiked: currentUserId ? (p.likedBy || []).some((id) => id === currentUserId || id?._id === currentUserId) : false,
            })),
        [posts, currentUserId]
    );

    const onlineCount = onlineUsers?.length || 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SEO
                title="Student Community — Ask & Share | Student Hub"
                description="Join the Mumbai IT student community. Ask questions about   notes, share MERN stack tips, and connect with other BSc IT students in India."
                url="/dashboard/community"
            />
            {/* Header */}
            <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Student Community
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Share, ask & help others
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                        Post quick updates, doubts, or tips for your batchmates. Keep it respectful and helpful.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white">
                    <div className="p-2 rounded-xl bg-slate-800/80">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-300 font-semibold">
                            Students Online
                        </p>
                        <p className="text-lg font-bold">
                            {onlineCount}
                            <span className="text-xs font-medium text-slate-300 ml-1">
                                live now
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Create Post */}
            <form
                onSubmit={handleCreate}
                className="glass-card rounded-2xl p-5 space-y-3"
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Start a new discussion
                    </p>
                </div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    placeholder="Title (optional)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Share a doubt, tip, or update with your community..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5"
                />
                {error && (
                    <p className="text-xs text-red-500 font-medium">
                        {error}
                    </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{content.length}/2000</span>
                    <button
                        type="submit"
                        disabled={creating}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {creating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Share with community
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Posts List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm font-medium">Loading community posts...</span>
                        </div>
                    </div>
                ) : enrichedPosts.length === 0 ? (
                    <div className="glass-card rounded-2xl p-6 text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            No posts yet.
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Be the first one to start a discussion!
                        </p>
                    </div>
                ) : (
                    enrichedPosts.map((post) => (
                        <article
                            key={post._id}
                            className="glass-card rounded-2xl p-4 border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {post.username?.charAt(0)?.toUpperCase() + post.username?.slice(1)}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {post.title && (
                                <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {post.title}
                                </h2>
                            )}
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                {post.content}
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleLike(post._id)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${post.isLiked
                                        ? "border-rose-500/40 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                                        : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                        }`}
                                >
                                    <Heart
                                        className={`w-3.5 h-3.5 ${post.isLiked ? "fill-current" : ""}`}
                                    />
                                    <span>{post.likesCount || 0}</span>
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

