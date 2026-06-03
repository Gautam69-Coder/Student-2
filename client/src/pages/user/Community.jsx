import React, { useEffect, useState, useMemo } from "react";
import { Heart, MessageSquare, Users, Send, Loader2, Home, FileText, FlaskConical, Code2, Info } from "lucide-react";
import { fetchCommunityPosts, createCommunityPost, toggleCommunityLike, getMe } from "@/Api/api";
import { useSocket } from "@/context/SocketContext";
import { SEO } from "@/components/common/SEO";
import { DashboardLayout, DashboardSidebar } from "@/components/dashboard";
import { theme } from "@/lib/theme";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [isBell, setIsBell] = useState(false);

    const navItems = [
        { label: "Home", icon: Home, path: "/dashboard" },
        { label: "Notes", icon: FileText, path: "/dashboard/notes" },
        { label: "Practicals", icon: FlaskConical, path: "/dashboard/practicals" },
        { label: "Practice", icon: Code2, path: "/dashboard/coding-practice" },
        { label: "Community", icon: Users, path: "/dashboard/community", active: true },
        { label: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },
        { label: "About", icon: Info, path: "/dashboard/about" },
    ];

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
        <DashboardLayout
            // sidebar={
            //     <DashboardSidebar
            //         navItems={navItems}
            //         userName="Student Name"
            //         userEmail="student@email.com"
            //         searchQuery={searchQuery}
            //         setSearchQuery={setSearchQuery}
            //         isBell={isBell}
            //         setisBell={setIsBell}
            //     />
            // }
            // topNavProps={{
            //     userName: "Lucas Bennett",
            //     userEmail: "bennett02@gmail.com",
            //     userAvatar: "https://i.pravatar.cc/150?img=33",
            //     searchQuery: searchQuery,
            //     setSearchQuery: setSearchQuery,
            //     isBell: isBell,
            //     setisBell: setIsBell,
            // }}
        >
            <SEO
                title="Student Community — Ask & Share | Student Hub"
                description="Join the Mumbai IT student community. Ask questions about notes, share MERN stack tips, and connect with other BSc IT students in India."
                url="/dashboard/community"
            />
            <div className="space-y-6">
                {/* Header */}
                <div
                    className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2" style={{ color: theme.colors.purple }}>
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase" style={{ color: theme.colors.darkGray }}>Student Community</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.colors.dark }}>
                            Share, ask & help others
                        </h1>
                        <p className="text-sm mt-2" style={{ color: theme.colors.darkGray }}>
                            Post quick updates, doubts, or tips for your batchmates. Keep it respectful and helpful.
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-lg"
                        style={{ background: theme.colors.lime }}
                    >
                        <div className="p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.1)" }}>
                            <Users size={20} style={{ color: theme.colors.dark }} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase" style={{ color: theme.colors.dark }}>Students Online</p>
                            <p className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                {onlineCount}
                                <span className="text-xs font-medium ml-1">live now</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Create Post */}
                <form
                    onSubmit={handleCreate}
                    className="rounded-2xl p-6 space-y-3"
                    style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}
                >
                    <p className="text-sm font-semibold" style={{ color: theme.colors.dark }}>Start a new discussion</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={120}
                        placeholder="Title (optional)"
                        className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none"
                        style={{
                            borderColor: theme.colors.lightGray,
                            color: theme.colors.dark,
                        }}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={2000}
                        rows={3}
                        placeholder="Share a doubt, tip, or update with your community..."
                        className="w-full px-4 py-2 rounded-lg border text-sm resize-none focus:outline-none"
                        style={{
                            borderColor: theme.colors.lightGray,
                            color: theme.colors.dark,
                        }}
                    />
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    <div className="flex items-center justify-between text-xs" style={{ color: theme.colors.darkGray }}>
                        <span>{content.length}/2000</span>
                        <button
                            type="submit"
                            disabled={creating}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
                            style={{
                                background: theme.colors.lime,
                                color: theme.colors.dark,
                            }}
                        >
                            {creating ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Share with community
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Posts List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="rounded-2xl p-6 flex items-center justify-center" style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}>
                            <div className="flex items-center gap-3" style={{ color: theme.colors.darkGray }}>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm font-medium">Loading community posts...</span>
                            </div>
                        </div>
                    ) : enrichedPosts.length === 0 ? (
                        <div className="rounded-2xl p-6 text-center" style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}>
                            <p className="text-sm font-medium" style={{ color: theme.colors.dark }}>No posts yet.</p>
                            <p className="text-xs mt-1" style={{ color: theme.colors.darkGray }}>Be the first one to start a discussion!</p>
                        </div>
                    ) : (
                        enrichedPosts.map((post) => (
                            <article
                                key={post._id}
                                className="rounded-2xl p-4"
                                style={{ background: theme.colors.white, border: `1px solid ${theme.colors.lightGray}` }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: theme.colors.dark }}>
                                            {post.username?.charAt(0)?.toUpperCase() + post.username?.slice(1)}
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: theme.colors.darkGray }}>
                                            {formatDate(post.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                {post.title && (
                                    <h2 className="mt-3 text-sm font-bold" style={{ color: theme.colors.dark }}>
                                        {post.title}
                                    </h2>
                                )}
                                <p className="mt-2 text-sm whitespace-pre-line" style={{ color: theme.colors.darkGray }}>
                                    {post.content}
                                </p>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleLike(post._id)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                                        style={{
                                            background: post.isLiked ? theme.colors.lime : theme.colors.white,
                                            color: post.isLiked ? theme.colors.dark : theme.colors.darkGray,
                                            border: `1px solid ${theme.colors.lightGray}`,
                                        }}
                                    >
                                        <Heart size={14} className={post.isLiked ? "fill-current" : ""} />
                                        <span>{post.likesCount || 0}</span>
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
