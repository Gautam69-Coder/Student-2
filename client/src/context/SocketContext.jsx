import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
    const socketRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastVisit, setLastVisit] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            // console.log('✅ Connected to WebSocket:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            // console.log('❌ Disconnected from WebSocket');
            setIsConnected(false);
        });

        socket.on('online_users_update', (users) => {
            // console.log('👥 Online users updated:', users);
            setOnlineUsers(users);
        });

        socket.on('user_visit', (data) => {
            setLastVisit(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Separate effect to handle user registration when user OR connection changes
    useEffect(() => {
        if (isConnected && user && socketRef.current) {
            // console.log('📤 Emitting user_online for:', user.username);
            socketRef.current.emit('user_online', {
                id: user._id || user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else if (isConnected && !user && socketRef.current) {
            // console.log('📤 Emitting user_logout');
            socketRef.current.emit('user_logout');
        }
    }, [user, isConnected]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, lastVisit, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
