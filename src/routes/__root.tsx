import {
  Outlet,
  Router,
  createRootRouteWithContext,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanstackDevtools } from '@tanstack/react-devtools';

import Header from '../components/Header';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const state = useRouterState();
    const isAuthRoute =
      !/^\/($|login$|404$|forgot-password(\/.*)?$|survey\/[^/]+$)/.test(
        state.location.pathname,
      );

    const user = useUserStore((s) => s.user);
    useEffect(() => {
      console.log({ user });
    }, [user]);

    return (
      <>
        <SidebarProvider className=" min-h-screen relative">
          {isAuthRoute && (
            <>
              <AppSidebar />
            </>
          )}
          <div className="bg-gradient-to-r from-blue-700 to-teal-700 w-full p-6">
            <Outlet />
          </div>
        </SidebarProvider>
        <Toaster closeButton position="top-center" duration={2000} />
        <TanstackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    );
  },
});
