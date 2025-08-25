import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/survey/$surveyId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { surveyId } = Route.useParams();

  return (
    <div>
      <Header />
      For public to answer the surveys {surveyId}
    </div>
  );
}
