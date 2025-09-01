import Header from '@/components/Header';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { api } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { CampaignPhase } from '@/components/CampaignCard';

export const Route = createFileRoute('/campaigns/$campaignId/$phase/survey')({
  component: RouteComponent,
});

function RouteComponent() {
  const { phase, campaignId } = Route.useParams();

  const {
    data: surveys,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['surveys', phase, campaignId],
    queryFn: async () => {
      const response = await api(`/survey/phase/${phase}/${campaignId}`, true);

      // Throw on non-ok so react-query sets isError
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }

      return await response.json();
    },
  });

  return (
    <div>
      <Header />

      {isLoading ? (
        <main className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Loading surveys…</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      ) : isError ? (
        <main className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Error loading surveys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                There was a problem fetching surveys. This can happen when the
                server is unavailable or your network connection is offline.
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-3">
                <Button variant="default" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      ) : (
        <SurveyBuilderPage
          surveys={surveys}
          phase={phase as CampaignPhase}
          campaignId={campaignId}
        />
      )}
    </div>
  );
}
