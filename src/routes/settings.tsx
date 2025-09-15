import Header from '@/components/Header';
import SettingsPage from '@/pages/SettingsPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <SettingsPage />
    </div>
  );
}
