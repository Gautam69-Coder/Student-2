import React, { createContext, useContext, useEffect, useState, useRef,useMemo  } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// const SOCKET_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
//     ? `http://${window.location.hostname}:5001`
//     : 'https://student-2-3ow8.onrender.com';

const SOCKET_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:5001`
    : 'https://student-2-temprory.onrender.com';

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastVisit, setLastVisit] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socketInstance = io(SOCKET_URL, {
            auth: {
                token: token
            },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        socketInstance.on('online_users_update', (users) => {
            setOnlineUsers(users);
        });

        socketInstance.on('user_visit', (data) => {
            setLastVisit(data);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

    // Separate effect to handle user registration when user OR connection changes
    useEffect(() => {
        if (isConnected && user && socket) {
            // console.log('📤 Emitting user_online for:', user.username);
            socket.emit('user_online', {
                id: user._id || user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else if (isConnected && !user && socket) {
            // console.log('📤 Emitting user_logout');
            socket.emit('user_logout');
        }
    }, [user, isConnected, socket]);

    // Memoize context value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => ({
        socket,
        onlineUsers,
        lastVisit,
        isConnected
    }), [socket, onlineUsers, lastVisit, isConnected]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
