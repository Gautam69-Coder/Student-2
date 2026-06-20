
import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sendTrackerHome } from "../../Api/api"
import {
    Home,
    FileText,
    FlaskConical,
    LogOut,
    Search,
    Bell,
    Menu,
    X,
    Upload,
    Users,
    User,
    MessageSquare,
    Info,
    ChevronDown,
    Code2
} from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Logo } from "../common/logo/logo";
import { ThemeToggle } from "../common/theme-toggle"
import Notification from "../common/notification"
import { getMe } from "../../Api/api"

const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "notes", label: "Notes", icon: FileText, path: "/dashboard/notes" },
    { id: "practicals", label: "Practicals", icon: FlaskConical, path: "/dashboard/practicals" },
    { id: "practice", label: "Practice", icon: Code2, path: "/dashboard/coding-practice" },
    { id: "community", label: "Community", icon: Users, path: "/dashboard/community" },

]

const moreItems = [
    { id: "feedback", label: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },
    { id: "about-contact", label: "About & Contact", icon: Info, path: "/dashboard/about-contact" },
]

const mobileMenuVariants = {
    hidden: { 
        opacity: 0, 
        height: 0,
        y: -15,
        transition: {
            height: { duration: 0.25, ease: "easeInOut" },
            opacity: { duration: 0.15 },
            y: { duration: 0.15 },
            staggerChildren: 0.03,
            staggerDirection: -1
        }
    },
    visible: { 
        opacity: 1, 
        height: "auto",
        y: 0,
        transition: {
            height: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 0.2 },
            y: { duration: 0.2 },
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

const mobileItemVariants = {
    hidden: { opacity: 0, x: -10, y: -5 },
    visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
};

export function StudentNavbar({
    searchQuery,
    setSearchQuery,
    onLogout,
    onSwitchToAdmin,
    role,
    setUploadModalOpen,
    isBell,
    setisBell,
    requireAuth
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [userData, setUserData] = useState([]);

    //useState for tacking navigation user
    const [track, setTrack] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const trackHome = useCallback(async (section) => {
        await sendTrackerHome(section);
    }, [])

    useEffect(() => {
        if (track !== null) {
            let sections = track?.split("/").pop();
            sections = sections.replace("-", "")
            if (sections == "dashboard") {
                sections = "home";
            }
            trackHome(sections);
        }
    }, [track])

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
        }
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        getMe()
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error("Authentication error:", error);
            });
    }, []);


    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "py-2 px-4 sm:px-3"
                : "py-4 px-4 sm:px-3"
                }`}
        >
            <div className={` shadow-md shadow-teal-300 dark:shadow-black mx-auto rounded-[10px] transition-all duration-300 ${scrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-800/50"
                : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 dark:border-slate-800/30"
                }`}>
                <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="p-1.5  rounded-xl transition-transform group-hover:scale-105">
                            <Logo className="w-6 h-6" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 mx-4">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`relative px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        active
                                            ? "text-white dark:text-slate-900 shadow-md"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                    }`}
                                    onClick={() => {
                                        setTrack(item.path)
                                    }}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-slate-900 dark:bg-white rounded-[10px] z-0"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={`w-4 h-4 z-10 ${active ? "text-white dark:text-slate-900" : ""}`} />
                                    <span className={`z-10 ${active ? "text-white dark:text-slate-900" : ""}`}>{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* More Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setMoreMenuOpen(!moreMenuOpen)
                                }
                                }
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${moreMenuOpen || moreItems.some(item => isActive(item.path))
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                More <ChevronDown className={`w-4 h-4 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {moreMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setMoreMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-48 bg-white dark:bg-slate-900  shadow-xl border rounded-[10px] border-slate-100 dark:border-slate-800 p-2 z-20"
                                        >
                                            {moreItems.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={item.path}
                                                    onClick={() => {
                                                        setMoreMenuOpen(false)
                                                        setTrack(item.path)
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                                        ? "bg-slate-100 rounded-lg dark:bg-slate-800 text-slate-900 dark:text-white "
                                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                        }`}
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                            <button
                                                onClick={() => {
                                                    setMoreMenuOpen(false);
                                                    onLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4 hidden sm:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search everything..."
                                className="w-full h-10 pl-10 pr-10 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 rounded-[10px] text-sm transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                >
                                    <X className="w-3 h-3 text-slate-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden xs:flex items-center gap-2">
                            {(role === "admin" || role === "superadmin") && (
                                <button
                                    onClick={onSwitchToAdmin}
                                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                                    title="Admin Panel"
                                >
                                    <Users className="w-5 h-5" />
                                </button>
                            )}

                        </div>
                        <button
                            onClick={() => setUploadModalOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-slate-900 dark:bg-white  text-white dark:text-slate-900 px-4 py-2 rounded-[10px] text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
                        >
                            <Upload className="w-4 h-4" />
                            Share
                        </button>


                        <div className="relative">
                            <button
                                onClick={() => setisBell(!isBell)}
                                className={`p-2 rounded-[10px] border border-slate-200 dark:border-slate-800 transition-all ${isBell
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                <Bell className="w-5 h-5" />
                            </button>
                            {isBell && (
                                <div className="absolute top-12 right-0 w-80 z-50">
                                    <Notification />
                                </div>
                            )}
                        </div>

                        {/* Profile Link for Desktop */}
                        <button
                            onClick={() => requireAuth(() => navigate("/dashboard/profile"))}
                            className={`hidden lg:flex ${userData.avatar ? null : "p-2 rounded-[10px] border border-slate-200 dark:border-slate-800"} transition-all ${isActive("/dashboard/profile")
                                ? "rounded-[15px] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                : " rounded-[15px] hover:shadow-blue-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                        >
                            {userData.avatar ? (
                                <img height={34} width={34}
                                    className="rounded-[10px]"
                                    src={userData.avatar} alt={userData?.avatar} />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </button>

                        {(role === "admin" || role === "superadmin") && (
                            <Link
                                to="/admin"
                                className={`hidden lg:flex p-2 rounded-[10px] border border-slate-200 dark:border-slate-800 transition-all ${isActive("/dashboard/profile")
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                <Users className="w-5 h-5" />
                            </Link>
                        )}


                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="lg:hidden mt-2 max-w-7xl mx-auto overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl"
                    >
                        <div className="p-4 space-y-2">
                            {/* Search for Mobile */}
                            <motion.div variants={mobileItemVariants} className="sm:hidden relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm"
                                />
                            </motion.div>

                            {[...navItems, ...moreItems].map((item) => (
                                <motion.div key={item.id} variants={mobileItemVariants}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive(item.path)
                                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-semibold">{item.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div variants={mobileItemVariants}>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        requireAuth(() => navigate("/dashboard/profile"));
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive("/dashboard/profile")
                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {userData.avatar ? (
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <img src={userData.avatar} className=" text-slate-400 dark:text-slate-500" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    )}
                                    <span className="font-semibold">Profile</span>
                                </button>
                            </motion.div>

                            <motion.div variants={mobileItemVariants} className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                            <motion.div variants={mobileItemVariants}>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setUploadModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span className="font-semibold">Share Notes</span>
                                </button>
                            </motion.div>

                            {(role === "admin" || role === "superadmin") && (
                                <motion.div variants={mobileItemVariants}>
                                    <button
                                        onClick={() => {
                                            navigate("/admin");
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <Users className="w-5 h-5" />
                                        <span className="font-semibold">Admin</span>
                                    </button>
                                </motion.div>
                            )}

                            <motion.div variants={mobileItemVariants}>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-semibold">Sign Out</span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
