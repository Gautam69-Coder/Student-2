
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    Calendar,
    Edit2,
    MapPin,
    LogOut,
    MessageSquare,
    Info,
    Lock,
    Eye,
    EyeOff,
    Save,
    ArrowRight
} from "lucide-react";
import { getMe, userProfileUpdate } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "@/Utils/customMessage";
import { DashboardLayout } from "@/components/layout/layout";
import { Card, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { theme } from "@/lib/theme";
import { useData } from "@/Context/DataContext"


export function Profile({ onLogout }) {

    const { user } = useData();

    useTitle("Profile");
    const [flipped, setFlipped] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userDetail, setUserDetail] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [userUpdate, setUserUpdate] = useState([])


    useEffect(() => {
        setUserDetail({
            username: user?.username || "",
            email: user?.email || "",
            password: "",
            confirmPassword: "",
        });
    }, [user, flipped]);


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
            if (updatedData.data.data.type === "success") {
                customMessage({ content: updatedData.data.message, type: updatedData.data.data.type });
                setTimeout(() => {
                    setFlipped(false);
                }, 1000)
            }
        } catch (error) {
            console.error(error)
            customMessage({ content: "Failed to update profile", type: "error" })
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto sm:py-8 sm:px-4  ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="perspective w-full h-full">
                        <motion.div
                            className={`relative w-full ${flipped ? "min-h-[90vh] sm:min-h-[95vh]" : "min-h-[150vh] sm:min-h-[120vh]"} `}
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Card Front - Profile info */}
                            <div
                                className="absolute inset-0  bg-white  rounded-[10px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5] shadow-sm"
                                style={{ backfaceVisibility: 'hidden' }}>

                                {/* Header/Cover */}
                                <div className="h-32 relative" style={{ background: "#CCFF00" }}>
                                    <div className="absolute -bottom-12 left-8 p-1 bg-white  rounded-2xl shadow-lg dark:shadow-none">
                                        {user.avatar ? (
                                            <div className="w-24 h-24 bg-slate-100  rounded-xl flex items-center justify-center overflow-hidden">
                                                <img src={user?.avatar} className="  text-black" />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 bg-slate-100  rounded-xl flex items-center justify-center overflow-hidden">
                                                <User className="w-12 h-12  text-black" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="pt-16 pb-8 px-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h1 className="text-2xl font-bold text-black ">{user.username?.charAt(0)?.toLocaleUpperCase() + user.username?.slice(1)?.toLocaleLowerCase()}</h1>
                                            <p className="text-slate-500 dark: font-medium">Student at University</p>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50  border border-slate-200  text-sm font-medium text-black  hover:bg-slate-100 dark:hover:bg-lime-500/80 transition-colors"
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
                                        <h3 className="text-lg font-bold text-black  mb-6 font-serif">Academic Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <StatCard label="Total Practicals" value="24" />
                                            <StatCard label="Notes Shared" value="12" />
                                            <StatCard label="Visit Count" value={user.visitCount || 0} />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100 shadow-sm space-y-3">
                                        <Link
                                            to="/dashboard/feedback"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50  text-black font-bold hover:bg-slate-200  transition-colors shadow-sm"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Send Feedback / Message
                                        </Link>

                                        <Link
                                            to="/dashboard/about-contact"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 text-black font-bold  transition-colors hover:bg-slate-200"
                                        >
                                            <Info className="w-5 h-5" />
                                            About & Contact Us
                                        </Link>

                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-900  text-white  font-bold  transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card Back - Edit Profile */}
                            <div
                                className="absolute inset-0 bg-white  rounded-[10px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5E5] shadow-sm"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                {/* Header/Cover */}
                                <div className="h-32  relative">
                                    <div className="absolute  -bottom-12 left-8 p-1 bg-white  rounded-2xl shadow-lg dark:shadow-none">
                                        {user.avatar ? (
                                            <div className="w-24 h-24 bg-slate-100  rounded-xl flex items-center justify-center overflow-hidden">
                                                <img src={user.avatar} className="  text-black" />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 bg-slate-100  rounded-xl flex items-center justify-center overflow-hidden">
                                                <User className="w-12 h-12  text-black" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-5 right-8">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50  border border-slate-200  text-sm font-medium text-black hover:bg-lime-500/80 transition-colors"
                                            onClick={() => { setFlipped(!flipped) }}
                                        >
                                            Back
                                            <ArrowRight className="w-4 h-4  text-black" />
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="pt-16 pb-8 px-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h1 className="text-2xl font-bold text-black ">{userDetail.username.charAt(0).toLocaleUpperCase() + userDetail.username.slice(1).toLocaleLowerCase()}</h1>
                                            <p className="text-black dark: font-medium">Student at University</p>
                                        </div>

                                        <div className="sm:block hidden">
                                            <InfoCard icon={<Mail />} label="Email Address" value={userDetail.email.toLocaleLowerCase()} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div>
                                            <label htmlFor="username" className="text-sm font-medium text-black">
                                                Full Name
                                            </label>
                                            <div className="relative mt-2">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4  text-black" />
                                                <input
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    placeholder={user.username}
                                                    value={userDetail.username}
                                                    onChange={(e) => { handleChanged(e) }}
                                                    className="w-full h-11 pl-10 pr-4 bg-slate-50/50  border border-slate-200 shadow-sm focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-black  placeholder: dark:placeholder:text-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="text-sm font-medium text-black">
                                                Email
                                            </label>
                                            <div className="relative mt-2">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4  text-black" />
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="text"
                                                    placeholder={user.email}
                                                    value={userDetail.email}
                                                    onChange={(e) => { handleChanged(e) }}
                                                    className="w-full h-11 pl-10 pr-4 bg-slate-50/50  border border-slate-200 shadow-sm focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-black  placeholder: dark:placeholder:text-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="text-sm font-medium text-black">
                                                Password
                                            </label>
                                            <div className="relative mt-2">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4  text-black" />
                                                <input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter your password"
                                                    value={userDetail.password}
                                                    onChange={(e) => { handleChanged(e) }}
                                                    className="w-full h-11 pl-10 pr-4 bg-slate-50/50  border border-slate-200 shadow-sm focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-black  placeholder: dark:placeholder:text-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                                                Confirm Password
                                            </label>
                                            <div className="relative mt-2 flex justify-center items-center ">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4  text-black" />
                                                <input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Confirm your Password  "
                                                    value={userDetail.confirmPassword}
                                                    onChange={(e) => { handleChanged(e) }}
                                                    className="w-full h-11 pl-10 pr-4 bg-slate-50/50  border border-slate-200 shadow-sm focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 rounded-lg transition-all text-sm text-black  placeholder: dark:placeholder:text-black"
                                                />
                                                <button
                                                    className="cursor-pointer border-2 ml-4 rounded-[10px] border-slate-200 shadow-sm"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <Eye className=" w-4 h-4 m-3  text-black cursor-pointer" />
                                                    ) : (
                                                        <EyeOff className=" w-4 h-4 m-3  text-black cursor-pointer" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-center">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50  border border-slate-200  text-sm font-medium text-black shadow-sm hover:bg-lime-500/80 transition-colors"
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
        </DashboardLayout>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50  border border-slate-200 shadow-sm">
            <div className="p-2.5 bg-white  rounded-xl shadow-sm text-black dark:">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div>
                <p className="text-xs font-medium  text-black uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-black  mt-0.5">{value || "N/A"}</p>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="p-6 rounded-2xl bg-white  border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-bold text-black ">{value}</p>
            <p className="text-sm font-medium text-black  mt-1">{label}</p>
        </div>
    );
}
