import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import './index.css';

const strictMode = import.meta.env.VITE_STRICT_MODE === 'true';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(

    strictMode ? (
        <StrictMode>
            <HelmetProvider>
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>
                </Provider>
            </HelmetProvider>
        </StrictMode>
    ) : (
        <HelmetProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </Provider>
        </HelmetProvider>
    )
);
