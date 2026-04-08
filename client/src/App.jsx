
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthSection } from '@/components/common/auth-section';
import { userDetail } from '@/lib/user';
import { NotFoundPage } from './Utils/Error';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from '@/hooks/useLenis';
import { CyberLoader } from '@/components/common/cyber-loader';
import { SocketProvider } from './context/SocketContext';
import { ServerOffline } from '@/components/common/server-offline';
import { message } from 'antd';

// Lazy-load heavy route components — drastically reduces initial bundle
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentDashboard = lazy(() =>
    import('@/pages/user/Dashboard').then(m => ({ default: m.StudentDashboard }))
);
const AdminPanel = lazy(() =>
    import('@/pages/admin/Dashboard').then(m => ({ default: m.AdminPanel }))
);
const AIAssistant = lazy(() =>
    import('@/components/common/ai-assistant').then(m => ({ default: m.AIAssistant }))
);

const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-background">
        <CyberLoader />
    </div>
);

// Helper component for protected routes
const ProtectedRoute = ({ isAuthenticated, children, redirectPath = "/" }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};

function AppContent({ onUserUpdate }) {
    useLenis();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("user");
    const [currentUser, setCurrentUser] = useState(null);
    const [authViewState, setAuthViewState] = useState("login");
    const [loading, setLoading] = useState(true);
    const [isServerOffline, setIsServerOffline] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleOffline = () => setIsServerOffline(true);
        window.addEventListener('server-offline', handleOffline);
        return () => window.removeEventListener('server-offline', handleOffline);
    }, []);

    const handleRetry = () => {
        setIsServerOffline(false);
        window.location.reload();
    };

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
                    onUserUpdate(user);
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

    const handleAuth = async (role, name) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setCurrentUser(name);
        const user = await userDetail();
        if (user) onUserUpdate(user);
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
        onUserUpdate(null);
        setAuthViewState("login");
        navigate('/');
    };

    if (isServerOffline) {
        return <ServerOffline onRetry={handleRetry} />;
    }

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen max-w-full sm:max-w-screen bg-background">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} replace />
                            ) : (
                                <LandingPage />
                            )
                        }
                    />

                    <Route
                        path="/auth"
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
            </Suspense>
            {isAuthenticated && (
                <Suspense fallback={null}>
                    <AIAssistant />
                </Suspense>
            )}
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);

    return (
        <ThemeProvider>
            <SocketProvider user={user}>
                <Router>
                    <AppContent onUserUpdate={setUser} />
                </Router>
            </SocketProvider>
        </ThemeProvider>
    );
}
