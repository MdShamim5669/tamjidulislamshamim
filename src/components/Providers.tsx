'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import PageTransitionCurtain from './PageTransitionCurtain';
import { warmUpBackend } from '../lib/api';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Silently pre-warm the Render backend on page load so it never goes cold
    warmUpBackend();

    // Keep backend alive every 9 minutes while visitor is on the site
    const keepAliveTimer = setInterval(() => {
      warmUpBackend();
    }, 9 * 60 * 1000);

    return () => clearInterval(keepAliveTimer);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 15, // Cache data in memory for 15 minutes (0ms page transitions!)
            gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection for 24h
            refetchOnWindowFocus: false, // Stop re-fetching backend on every tab switch
            refetchOnMount: false, // Instant navigation using cached data
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PageTransitionCurtain />
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(18, 6, 11, 0.95)',
            border: '1px solid rgba(226, 194, 164, 0.25)',
            color: '#f5eeea',
            backdropFilter: 'blur(16px)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
