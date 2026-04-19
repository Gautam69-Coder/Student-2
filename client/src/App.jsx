import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthSection } from '@/components/common/auth-section';
import { userDetail } from '@/lib/user';
import { NotFoundPage } from './Utils/Error';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from '@/hooks/useLenis';
import { CyberLoader } from '@/components/common/cyber-loader';
import { SocketProvider } from './context/SocketContext';
import { DataProvider, useData } from './context/DataContext';
import { ServerOffline } from '@/components/common/server-offline';
import { message } from 'antd';
import MotionFlipCard from './Utils/Test';

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

function AppContent() {
    useLenis();
    const { user, loading: dataLoading, logout } = useData();
    const [authViewState, setAuthViewState] = useState("login");
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

    const handleAuth = async (role, name) => {
        localStorage.setItem('isAuthenticated', 'true');
        // Reload to re-trigger context fetches and state updates
        window.location.reload();
    };

    const handleLogout = async () => {
        try {
            const { logoutUser } = await import('@/Api/api');
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        }
        logout();
        setAuthViewState("login");
        navigate('/');
    };

    if (isServerOffline) {
        return <ServerOffline onRetry={handleRetry} />;
    }

    if (dataLoading.user) {
        return <PageLoader />;
    }

    const isAuthenticated = !!user;
    const userRole = user?.role || "user";
    const currentUser = user?.username;

    return (
        <div className="min-h-screen max-w-full sm:max-w-screen bg-background">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path='/test' element={<MotionFlipCard/>} />
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
    return (
        <ThemeProvider>
            <DataProvider>
                <ContextWrapper />
            </DataProvider>
        </ThemeProvider>
    );
}

function ContextWrapper() {
    const { user } = useData();
    return (
        <SocketProvider user={user}>
            <Router>
                <AppContent />
            </Router>
        </SocketProvider>
    );
}
