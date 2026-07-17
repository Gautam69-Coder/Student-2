import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
const NotFoundPage = lazy(() =>
    import('./Utils/Error').then(m => ({ default: m.NotFoundPage }))
);
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from '@/hooks/useLenis';
import { CyberLoader } from '@/components/common/cyber-loader';
import { SocketProvider } from './context/SocketContext';
import { DataProvider, useData } from './context/DataContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '@/store/slices/authSlice';
import { ServerOffline } from '@/components/common/server-offline';

// Lazy-load heavy ka use for  route components —  reduces initial bundle size
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const StudentDashboard = lazy(() =>
    import('@/pages/user/Dashboard').then(m => ({ default: m.StudentDashboard }))
);
const AdminPanel = lazy(() =>
    import('@/pages/admin/Dashboard').then(m => ({ default: m.AdminPanel }))
);
const LoginPage = lazy(() => import('./pages/auth/Login'));
const SignupPage = lazy(() => import('./pages/auth/Signup'));
const AIAssistant = lazy(() =>
    import('@/components/common/ai-assistant').then(m => ({ default: m.AIAssistant }))
);
const BlogList = lazy(() => import('./pages/blog/BlogList'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-background">
        <CyberLoader />
    </div>
);

// Helper component for protected routes
const ProtectedRoute = ({ isAuthenticated, children, redirectPath = "/" }) => {
    // BUG-20 fix: Use the actual reactive isAuthenticated state instead of easily-bypassed localStorage flag
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};

function AppContent() {
    useLenis();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { loading: dataLoading, logout: contextLogout } = useData();
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
        const auth= localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
        window.location.reload()
    };

    const handleLogout = async () => {
        try {
            const { logoutUser } = await import('@/Api/api');
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        }
        contextLogout();
        dispatch(reduxLogout());
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
        <div className="min-h-screen max-w-full sm:max-w-screen ">
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
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} replace />
                            ) : (
                                <LoginPage onAuth={handleAuth} />
                            )
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            isAuthenticated ? (
                                <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} replace />
                            ) : (
                                <SignupPage onAuth={handleAuth} />
                            )
                        }
                    />

                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} redirectPath="/">
                                <StudentDashboard
                                    userName={currentUser || "Student"}
                                    onLogout={handleLogout}
                                    onAuth={handleAuth}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/*"
                        element={
                            // BUG-21 fix: Check if user is authenticated and is an admin/superadmin
                            <ProtectedRoute isAuthenticated={isAuthenticated && ['admin', 'superadmin'].includes(userRole)} redirectPath="/dashboard">
                                <AdminPanel
                                    userName={currentUser || "Admin"}
                                    onLogout={handleLogout}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <NotFoundPage />
                            </Suspense>
                        }
                    />
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
