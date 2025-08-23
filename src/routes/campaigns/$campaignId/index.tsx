import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/campaigns/$campaignId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { campaignId } = Route.useParams();
  return <div>Hello "/campaigns/$campaignId/"!{campaignId}</div>;
}
