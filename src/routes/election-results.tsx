import { createFileRoute } from '@tanstack/react-router';
import ElectionResultsPage from '@/pages/ElectionResultsPage';
import Header from '@/components/Header';

export const Route = createFileRoute('/election-results')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Header />
      <ElectionResultsPage />
    </div>
  );
}
