import User from '../models/User.js';

const onlineUsers = new Set();
const userMap = new Map(); // socket.id -> { userId, username }

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('🔌 New connection attempt:', socket.id);

        socket.on('user_online', async (userData) => {
            if (!socket.user) {
                console.log('⚠️ Rejected unauthenticated user_online emit on socket:', socket.id);
                return;
            }

            const userId = String(socket.user.id);
            const userRole = socket.user.role;
            const username = userData?.username || 'User';
            const email = userData?.email || '';

            onlineUsers.add(userId);
            userMap.set(socket.id, { id: userId, username, email, role: userRole });

            try {
                // Increment visit count in database securely
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc: { visitCount: 1 },
                        currentVisit: new Date(),
                        currentVisitTime: new Date().toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: 'Asia/Kolkata',
                        })
                    },
                    { new: true }
                );

                // Broadcast update so admin table sees new visit count
                io.emit('user_stats_update', {
                    userId: userId,
                    visitCount: updatedUser?.visitCount,
                    currentVisit: updatedUser?.currentVisit,
                    currentVisitTime: updatedUser?.currentVisitTime
                });
            } catch (err) {
                console.error('❌ Error updating visit count:', err.message);
            }

            io.emit('online_users_update', Array.from(onlineUsers));
            io.emit('user_visit', { id: userId, username, email, role: userRole, timestamp: new Date() });
        });

        socket.on('user_logout', async () => {
            const userData = userMap.get(socket.id);
            if (userData) {
                console.log(`📤 User Logged Out: ${userData.username}`);
                userMap.delete(socket.id);

                // Check if user has other tabs open
                const stillOnline = Array.from(userMap.values()).some(u => String(u.id) === String(userData.id));
                if (!stillOnline) {
                    onlineUsers.delete(String(userData.id));
                    console.log(`📉 User removed from online list: ${userData.username}`);
                    io.emit('online_users_update', Array.from(onlineUsers));
                }
            }
        });

        socket.on('disconnect', async () => {
            const userData = userMap.get(socket.id);
            if (userData) {
                userMap.delete(socket.id);
                const userId = String(userData.id);

                try {
                    const updatedUser = await User.findByIdAndUpdate(
                        userId,
                        {
                            $inc: { visitCount: 1 },
                            lastVisit: new Date(),
                            lastVisitTime: new Date().toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                timeZone: 'Asia/Kolkata',
                            })
                        },
                        { new: true }
                    );

                    console.log(`📈 Disconnect ${userData.username}: ${updatedUser?.lastVisitTime}`);
                    if (updatedUser) {
                        await updatedUser.save();
                    }
                } catch (err) {
                    console.error('❌ Error updating disconnect visit:', err.message);
                }

                // Check if user has other tabs open
                const stillOnline = Array.from(userMap.values()).some(u => String(u.id) === String(userData.id));
                if (!stillOnline) {
                    onlineUsers.delete(String(userData.id));
                    console.log(`📊 Total Unique Online: ${onlineUsers.size}`);
                    io.emit('online_users_update', Array.from(onlineUsers));
                }
            } else {
                console.log('🔌 Anonymous connection closed:', socket.id);
            }
        });
    });
};
