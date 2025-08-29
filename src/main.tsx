import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';

// Import the user store for rehydration
import { useUserStore } from '@/stores/useUserStore';
import { api } from './utils/utils.ts';

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
// Try to rehydrate the auth state on startup using token in localStorage
async function initAuth() {
  const token = localStorage.getItem('beca_token');
  if (!token) return;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    const res = await api(`/auth/me`, true);

    if (!res.ok) {
      // Token invalid or expired — remove and keep user empty
      localStorage.removeItem('beca_token');
      useUserStore.setState({
        user: null,
      });
      return;
    }

    const data = await res.json();

    useUserStore.setState(data);
  } catch (err) {
    console.error('Auth rehydrate error', err);
  }
}

async function checkAuth() {
  const token = localStorage.getItem('beca_token');
  const user = useUserStore.getState().user;

  // If neither token nor user is present, navigate to the root route
  if (!token && !user) {
    // use the router instance directly (can't use hooks outside components)
    router.navigate({ to: '/' });
  }
}
// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  (async () => {
    await initAuth();
    await checkAuth();
    root.render(
      <StrictMode>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <RouterProvider router={router} />
        </TanStackQueryProvider.Provider>
      </StrictMode>,
    );
  })();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
