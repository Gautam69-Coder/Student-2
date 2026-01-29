
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

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("user");
    const [currentUser, setCurrentUser] = useState(null);
    const [authViewState, setAuthViewState] = useState("login"); // login or signup
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            setIsAuthenticated(true);
            userDetail().then((user) => {
                setUserRole(user.role);
                setCurrentUser(user.username);
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
                setLoading(false);
            })
        }
        else {
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const handleAuth = (role, name) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setCurrentUser(name);
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        setCurrentUser(null);
        setAuthViewState("login");
        navigate('/');
    };

    const handleSwitchToAdmin = () => {
        setUserRole('admin');
        navigate('/admin');
    }

    const handleSwitchToStudent = () => {
        setUserRole('student');
        navigate('/dashboard');
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <SquirelLoader />
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-background">
            <Routes>
                <Route
                    path="/"
                    element={
                        !isAuthenticated ? (
                            <AuthSection
                                authState={authViewState}
                                setAuthState={setAuthViewState}
                                onAuth={handleAuth}
                            />
                        ) : (
                            <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />
                        )
                    }
                />

                <Route
                    path="/dashboard/*"
                    element={
                        isAuthenticated ? (
                            <StudentDashboard
                                userName={currentUser || "Student"}
                                onLogout={handleLogout}
                                onSwitchToAdmin={handleSwitchToAdmin}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                <Route
                    path="/admin/*"
                    element={
                        isAuthenticated ? (
                            <AdminPanel
                                userName={currentUser || "Admin"}
                                onLogout={handleLogout}
                                onSwitchToStudent={handleSwitchToStudent}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
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
