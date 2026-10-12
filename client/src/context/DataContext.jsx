import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, logout as reduxLogout } from '@/store/slices/authSlice';
import { userDetail } from '@/lib/user';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Fetch User Profile (Bootstrap auth state)
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

    const logout = () => {
        setUser(null);
        dispatch(reduxLogout());
        queryClient.clear();
    };

    // Backward-compatible adapter reading from TanStack Query cache on-demand without eager root fetching
    const value = {
        user,
        setUser,
        get subjects() {
            return queryClient.getQueryData(['subjects']) || [];
        },
        get practicals() {
            return queryClient.getQueryData(['practicals']) || [];
        },
        get notes() {
            return queryClient.getQueryData(['notes']) || [];
        },
        get codingPractices() {
            return queryClient.getQueryData(['codingPractices']) || [];
        },
        allusers: [],
        loading: {
            user: userLoading,
            subjects: false,
            practicals: false,
            notes: false,
            allUsers: false,
            codingPractices: false
        },
        refreshCodingPractices: () => queryClient.invalidateQueries({ queryKey: ['codingPractices'] }),
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
