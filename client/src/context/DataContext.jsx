import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, logout as reduxLogout } from '@/store/slices/authSlice';
import { fetchSections, fetchPracticals, fetchNotes } from '@/Api/api';
import { userDetail } from '@/lib/user';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Fetch User Profile (Keeping this manual as it relates to auth state)
    useEffect(() => {
        const loadUser = async () => {
            const authFlag = localStorage.getItem('isAuthenticated');
            if (!authFlag) {
                setUserLoading(false);
                return;
            }
            try {
                const data = await userDetail();
                setUser(data);
                dispatch(setReduxUser(data));
            } catch (error) {
                console.error("Error fetching user detail:", error);
            } finally {
                setUserLoading(false);
            }
        };
        loadUser();
    }, [dispatch]);

    // Use React Query for Subjects
    const { 
        data: subjectsData, 
        isLoading: subjectsLoading
    } = useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const res = await fetchSections();
            return res.data;
        },
        enabled: !!user,
    });

    // Use React Query for Practicals
    const { 
        data: practicalsData, 
        isLoading: practicalsLoading
    } = useQuery({
        queryKey: ['practicals'],
        queryFn: async () => {
            const res = await fetchPracticals();
            return res.data;
        },
        enabled: !!user,
    });

    // Use React Query for Notes
    const { 
        data: notesData, 
        isLoading: notesLoading
    } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await fetchNotes();
            return res.data;
        },
        enabled: !!user,
    });

    const logout = () => {
        setUser(null);
        dispatch(reduxLogout());
        queryClient.clear();
    };

    const value = {
        user,
        setUser,
        subjects: subjectsData || [],
        practicals: practicalsData || [],
        notes: notesData || [],
        loading: {
            user: userLoading,
            subjects: subjectsLoading,
            practicals: practicalsLoading,
            notes: notesLoading
        },
        refreshNotes: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
        refreshPracticals: () => queryClient.invalidateQueries({ queryKey: ['practicals'] }),
        refreshSubjects: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
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
