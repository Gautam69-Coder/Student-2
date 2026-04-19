import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSections, fetchPracticals, fetchNotes } from '@/Api/api';
import { userDetail } from '@/lib/user';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [practicals, setPracticals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState({
        user: true,
        subjects: true,
        practicals: true,
        notes: true
    });
    const [refreshKeys, setRefreshKeys] = useState({
        notes: 0,
        practicals: 0,
        subjects: 0
    });

    const refreshNotes = useCallback(() => {
        setRefreshKeys(prev => ({ ...prev, notes: prev.notes + 1 }));
    }, []);

    const refreshPracticals = useCallback(() => {
        setRefreshKeys(prev => ({ ...prev, practicals: prev.practicals + 1 }));
    }, []);

    const refreshSubjects = useCallback(() => {
        setRefreshKeys(prev => ({ ...prev, subjects: prev.subjects + 1 }));
    }, []);

    // Fetch User Profile
    useEffect(() => {
        const loadUser = async () => {
            const authFlag = localStorage.getItem('isAuthenticated');
            if (!authFlag) {
                setLoading(prev => ({ ...prev, user: false }));
                return;
            }
            try {
                const data = await userDetail();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user detail:", error);
            } finally {
                setLoading(prev => ({ ...prev, user: false }));
            }
        };
        loadUser();
    }, []);

    // Fetch Subjects
    useEffect(() => {
        if (!user) return;
        const loadSubjects = async () => {
            setLoading(prev => ({ ...prev, subjects: true }));
            try {
                const res = await fetchSections();
                setSubjects(res.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(prev => ({ ...prev, subjects: false }));
            }
        };
        loadSubjects();
    }, [user, refreshKeys.subjects]);

    // Fetch Practicals
    useEffect(() => {
        if (!user) return;
        const loadPracticals = async () => {
            setLoading(prev => ({ ...prev, practicals: true }));
            try {
                const res = await fetchPracticals();
                setPracticals(res.data);
            } catch (error) {
                console.error("Error fetching practicals:", error);
            } finally {
                setLoading(prev => ({ ...prev, practicals: false }));
            }
        };
        loadPracticals();
    }, [user, refreshKeys.practicals]);

    // Fetch Notes
    useEffect(() => {
        if (!user) return;
        const loadNotes = async () => {
            setLoading(prev => ({ ...prev, notes: true }));
            try {
                const res = await fetchNotes();
                setNotes(res.data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(prev => ({ ...prev, notes: false }));
            }
        };
        loadNotes();
    }, [user, refreshKeys.notes]);

    const logout = () => {
        setUser(null);
        setSubjects([]);
        setPracticals([]);
        setNotes([]);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        setUser,
        subjects,
        practicals,
        notes,
        loading,
        refreshNotes,
        refreshPracticals,
        refreshSubjects,
        logout
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
