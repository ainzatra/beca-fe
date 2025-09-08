import { createFileRoute, redirect } from '@tanstack/react-router';
import images from '@/constants/images';
import { DashboardPage } from '@/pages/DashboardPage';
import Header from '@/components/Header';
import { useUserStore } from '@/stores/useUserStore';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Dashboard route composed from smaller components:
 * - StatCard (src/components/dashboard/StatCard.tsx)
 * - PrescriptivePanel (src/components/dashboard/PrescriptivePanel.tsx)
 * - Sidebar (src/components/ui/sidebar.tsx)
 *
 * Colors and theme tokens were adjusted in src/styles.css to a more pleasing palette.
 */

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Header />
      <DashboardPage />
    </div>
  );
}
