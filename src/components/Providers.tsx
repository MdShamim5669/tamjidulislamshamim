'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Always fetch fresh live data from database
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
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
