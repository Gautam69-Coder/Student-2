
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Calendar, Edit2, MapPin, ArrowRight, LogOut, MessageSquare, Info, Lock, Eye, EyeOff } from "lucide-react";
import { getMe,userProfileUpdate } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "../../Utils/customMessage"

export function Profile({ onLogout }) {
    useTitle("Profile");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flipped, setFlipped] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userDetail, setUserDetail] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [userUpdate, setUserUpdate] = useState([])

    //Fetch userData
    const fetchUserData = () => {
        getMe().then(res => {
            setUser(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        setUserDetail({
            username: user?.username || "",
            email: user?.email || "",
            password: "",
            confirmPassword: "",
        });
    }, [user, flipped]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-12 text-slate-500">Failed to load profile details.</div>;
    }

    const handleChanged = (e) => {
        setUserDetail({ ...userDetail, [e.target.name]: e.target.value })
        setUserUpdate([...userUpdate, e.target.name])
    }

    const handleSubmit = async () => {

        try {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (userDetail.email && !emailRegex.test(userDetail.email)) {
                return customMessage({ content: "Please enter a valid email address", type: "error" })
            }

            if (userDetail.email.length < 5 || userDetail.email.length > 254) {
                return customMessage({ content: "Email should be between 5 and 254 characters", type: "error" })
            }

            if (userDetail.password !== userDetail.confirmPassword) {
                return customMessage({ content: "Password and confirm Pasword are not match", type: "error" })
            }

            //get uniques fileds 
            const uniquieFiled = [...new Set(userUpdate)]

            // convert array to key value pairs
            const newObj = Object.fromEntries(
                uniquieFiled.map(key => [key, userDetail[key]])
            )

            const updatedData = await userProfileUpdate(newObj);
            if (updatedData.data.type === "success") {
                customMessage({ content: updatedData.data.msg, type: updatedData.data.type });
                setTimeout(() => {
                    setFlipped(false);
                }, 1000)
            }
        } catch (error) {
            console.error(error)
            customMessage("Failed to update profile", "error")
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="perspective w-full h-full">
                    <motion.div
                        className="relative w-full min-h-[90vh] sm:min-h-[95vh]"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Card Front - Profile info */}
                        <div
                            className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5] dark:border-slate-800"
                            style={{ backfaceVisibility: 'hidden' }}>

                            {/* Header/Cover */}
                            <div className="h-32 bg-slate-900 dark:bg-slate-950 relative">
                                <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none">
                                    {user?.avatar ? (
                                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <img src={`${user?.avatar}`} className=" text-slate-400 dark:text-slate-500" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-16 pb-8 px-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username?.charAt(0)?.toLocaleUpperCase() + user.username?.slice(1)?.toLocaleLowerCase()}</h1>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Student at University</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                                        onClick={() => setFlipped(!flipped)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoCard icon={<Mail />} label="Email Address" value={user.email} />
                                    <InfoCard icon={<Shield />} label="Account Role" value={user.role?.toUpperCase()} />
                                    <InfoCard icon={<Calendar />} label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"} />
                                    <InfoCard icon={<MapPin />} label="Location" value="India" />
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-serif">Academic Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard label="Total Practicals" value="24" />
                                        <StatCard label="Notes Shared" value="12" />
                                        <StatCard label="Visit Count" value={user.visitCount || 0} />
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <Link
                                        to="/dashboard/feedback"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        Send Feedback / Message
                                    </Link>

                                    <Link
                                        to="/dashboard/about-contact"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                                    >
                                        <Info className="w-5 h-5" />
                                        About & Contact Us
                                    </Link>

                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Back - Edit Profile */}
                        <div
                            className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5] dark:border-slate-800"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            {/* Header/Cover */}
                            <div className="h-32 bg-slate-900  dark:bg-slate-950 relative">
                                <div className="absolute  -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none">
                                    {user.avatar ? (
                                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <img src={user.avatar} className=" text-slate-400 dark:text-slate-500" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                            <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-5 right-8">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                                        onClick={() => { setFlipped(!flipped) }}
                                    >
                                        Back
                                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-16 pb-8 px-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{userDetail.username.charAt(0).toLocaleUpperCase() + userDetail.username.slice(1).toLocaleLowerCase()}</h1>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Student at University</p>
                                    </div>

                                    <div className="sm:block hidden">
                                        <InfoCard icon={<Mail />} label="Email Address" value={userDetail.email.toLocaleLowerCase()} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Full Name
                                        </label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <input
                                                id="username"
                                                type="text"
                                                name="username"
                                                placeholder={user.username}
                                                value={userDetail.username}
                                                onChange={(e) => { handleChanged(e) }}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Email
                                        </label>
                                        <div className="relative mt-2">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <input
                                                id="email"
                                                name="email"
                                                type="text"
                                                placeholder={user.email}
                                                value={userDetail.email}
                                                onChange={(e) => { handleChanged(e) }}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Password
                                        </label>
                                        <div className="relative mt-2">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                value={userDetail.password}
                                                onChange={(e) => { handleChanged(e) }}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Confirm Password
                                        </label>
                                        <div className="relative mt-2 flex justify-center items-center ">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={userDetail.confirmPassword}
                                                onChange={(e) => { handleChanged(e) }}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                            <button
                                                className="cursor-pointer border-2 ml-4 rounded-[10px] border-slate-200 dark:border-slate-800"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <Eye className=" w-4 h-4 m-3 text-slate-400 dark:text-slate-500 cursor-pointer" />
                                                ) : (
                                                    <EyeOff className=" w-4 h-4 m-3 text-slate-400 dark:text-slate-500 cursor-pointer" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                                        onClick={() => { handleSubmit() }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-400">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-0.5">{value || "N/A"}</p>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        </div>
    );
}
