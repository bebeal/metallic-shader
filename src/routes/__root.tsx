// __root.tsx: root of the tanstack router
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { QueryClient } from '@tanstack/react-query';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className='flex flex-col h-full min-h-screen overflow-auto'>
        <Outlet />
        <ThemeToggle />
      </div>
    );
  },
});
