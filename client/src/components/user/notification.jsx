import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import { useState, useEffect } from 'react'
import { fetchNotifications } from '@/Api/api';


const notification = () => {

    const [notifications, setNotifications] = useState([]);
    const [isReading, setIsReading] = useState(true);


    useEffect(() => {
        const fetchNotificationsData = async () => {
            try {
                const response = await fetchNotifications();
                // setNotifications(response.data);
                console.log("Fetched Notifications:", response.data);
                setNotifications(response.data);

            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotificationsData();
    }, []);

    // useEffect(() => {
    //     // Simulating fetching notifications
    //     setNotifications([
    //         { id: 1, title: "System Update", content: "Version 2.0 will be released on 30th June 2026." },
    //         { id: 2, title: "New Feature", content: "We've added a new feature to improve your experience." },
    //         { id: 2, title: "New Feature", content: "We've added a new feature to improve your experience." },
    //         { id: 2, title: "New Feature", content: "We've added a new feature to improve your experience." },
    //     ]);
    // }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 10, x: 500 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className=" absolute sm:right-8 right-4  sm:w-120 w-80 top-20  rounded-2xl bg-white dark:bg-slate-800  shadow-md p-2 border border-slate-200 dark:border-slate-700">

                <div className='flex justify-between border-b border-slate-200 dark:border-slate-700'>
                    <p className="text-sm font-bold text-slate-900 dark:text-white p-3 ">Notifications</p>
                    <div className=" flex justify-between items-center ">
                        <Bell className="w-4 h-4  text-slate-500 dark:text-slate-400" />
                    </div>
                </div>
                <div className="h-full w-full max-h-60 overflow-x-scroll" data-lenis-prevent>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id}>
                                <div className="flex  w-full items-center gap-3 p-3 border-b border-slate-200 dark:border-slate-700">
                                    <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                        <Bell className="sm:w-4 sm:h-4 w-3 h-3 text-slate-900 dark:text-white" />
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <div className='w-[60%]'>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{notification.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                                        </div>
                                        {/* {isReading ? (
                                            <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 ml-2" onMouseEnter={()=>{setIsReading(false)}}></div>
                                        ) : (
                                            null
                                        )} */}
                                        <div className='sm:text-base text-[10px] w-[30%] '>
                                            <div className=" text-slate-500 dark:text-slate-400">{notification.date || "No date"}</div>
                                            <div className=" text-slate-500 dark:text-slate-400">{notification.time || "No time"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 p-3">No notifications</p>
                    )}
                </div>


            </motion.div>
        </AnimatePresence>
    )
}

export default notification
