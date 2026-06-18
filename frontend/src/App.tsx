import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { router } from '@/routes/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes
      gcTime:    10 * 60 * 1000,  // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Apply dark theme on mount
const theme = localStorage.getItem('sms_theme') ?? 'dark';
if (theme === 'dark') document.documentElement.classList.add('dark');

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
