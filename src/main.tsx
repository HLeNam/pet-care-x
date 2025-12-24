import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import router from '~/routes';
import { AppProvider } from '~/contexts';
import { queryClient } from '~/constants/queryClient';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
