
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthSection } from '@/components/common/auth-section';
import { StudentDashboard } from '@/pages/user/Dashboard';
import { AdminPanel } from '@/pages/admin/Dashboard';
import { AIAssistant } from '@/components/common/ai-assistant';
import { userDetail } from '@/lib/user';
import { TimeLine } from '@/Utils/loaders';
import { NotFoundPage } from './Utils/Error';
import { SquirelLoader } from './Utils/loaders';

// Helper component for protected routes
const ProtectedRoute = ({ isAuthenticated, children, redirectPath = "/" }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("user");
    const [currentUser, setCurrentUser] = useState(null);
    const [authViewState, setAuthViewState] = useState("login");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const authFlag = localStorage.getItem('isAuthenticated');
            if (!authFlag) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const user = await userDetail();
                if (user) {
                    setIsAuthenticated(true);
                    setUserRole(user.role);
                    setCurrentUser(user.username);
                } else {
                    throw new Error("User not found");
                }
            } catch (error) {
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleAuth = (role, name) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setCurrentUser(name);
        navigate(role === 'admin' ? '/admin' : '/dashboard');
    };

    const handleLogout = async () => {
        try {
            const { logoutUser } = await import('@/Api/api');
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        }
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        setCurrentUser(null);
        setAuthViewState("login");
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <SquirelLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} replace />
                        ) : (
                            <AuthSection
                                authState={authViewState}
                                setAuthState={setAuthViewState}
                                onAuth={handleAuth}
                            />
                        )
                    }
                />

                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <StudentDashboard
                                userName={currentUser || "Student"}
                                onLogout={handleLogout}
                                onSwitchToAdmin={() => {
                                    setUserRole('admin');
                                    navigate('/admin');
                                }}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AdminPanel
                                userName={currentUser || "Admin"}
                                onLogout={handleLogout}
                                onSwitchToStudent={() => {
                                    setUserRole('user');
                                    navigate('/dashboard');
                                }}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {isAuthenticated && <AIAssistant />}
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
