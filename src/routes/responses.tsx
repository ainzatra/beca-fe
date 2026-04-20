import Header from '@/components/Header';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { toast } from 'sonner';
import type { Survey } from '@/pages/SurveyBuilderPage';
import type { Campaign } from '@/components/CampaignCard';
import ResponsesTable from '@/components/ResponsesTable';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useUserStore } from '@/stores/useUserStore';

export const Route = createFileRoute('/responses')({
  component: RouteComponent,
  beforeLoad: () => {
    const user = useUserStore.getState().user;

    if (!user) {
      throw redirect({
        to: '/login',
      });
    }

    if (user.role === 'SURVEYOR') {
      throw redirect({
        to: '/not-found',
      });
    }
  },
});

const PHASES = ['PRE', 'MID', 'POST'] as const;
type Phase = (typeof PHASES)[number];

function RouteComponent() {
  const { campaign, phase }: { campaign: string; phase: Phase } =
    Route.useSearch();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    campaign ?? null,
  );
  const [selectedPhase, setSelectedPhase] = useState<Phase>(phase ?? 'PRE');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const {
    data: campaigns = [],
    isLoading,
    isError,
  } = useQuery<any[]>({
    queryKey: ['campaigns', 'withSurveys'],
    queryFn: async () => {
      // Request campaigns and include surveys in the response if supported
      const res = await api('/campaign/with-survey', true);
      if (!res.ok) {
        toast.error('Error fetching campaigns');
        throw new Error('Failed to fetch campaigns');
      }
      return res.json();
    },
  });

  // initialize selected campaign and phase on first load
  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
      setSelectedPhase('PRE');
    }
  }, [campaigns, selectedCampaignId]);

  // derive current campaign object
  const selectedCampaign = useMemo(() => {
    return campaigns.find((c: any) => c.id === selectedCampaignId) ?? null;
  }, [campaigns, selectedCampaignId]);

  // derive surveys filtered by phase
  const surveysForPhase: Survey[] = useMemo(() => {
    const surveys: Survey[] = (selectedCampaign?.surveys as Survey[]) ?? [];
    return surveys.filter(
      (s) => String(s.phase).toUpperCase() === selectedPhase,
    );
  }, [selectedCampaign, selectedPhase]);

  // set selected survey when the filtered list changes
  useEffect(() => {
    if (surveysForPhase.length > 0) {
      setSelectedSurveyId((prev) =>
        prev && surveysForPhase.some((s) => s.id === prev)
          ? prev
          : surveysForPhase[0].id,
      );
    } else {
      setSelectedSurveyId(null);
    }
  }, [surveysForPhase]);

  // fetch responses for the selected survey
  const {
    data: responses = [],
    isLoading: isResponsesLoading,
    isError: isResponsesError,
    refetch: refetchResponses,
  } = useQuery<any[]>({
    queryKey: ['responses', selectedSurveyId],
    enabled: !!selectedSurveyId,
    queryFn: async () => {
      if (!selectedSurveyId) return [];
      // expected backend endpoint: GET /response/survey/:surveyId
      const res = await api(`/response/survey/${selectedSurveyId}`, true);
      if (!res.ok) {
        toast.error('Error fetching responses');
        throw new Error('Failed to fetch responses');
      }
      return res.json();
    },
  });

  return (
    <div className="p-6">
      <Header />
      <div className="rounded-lg bg-white p-6 shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          {/* Campaign select */}
          <div>
            <label className="text-sm block mb-1">Campaign</label>
            {isLoading ? (
              <div className="w-64 h-10 rounded border bg-slate-50 flex items-center px-3">
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="w-64 h-10 rounded border bg-slate-50 flex items-center px-3">
                No campaigns
              </div>
            ) : (
              <Select
                value={selectedCampaignId ?? ''}
                onValueChange={(v) => setSelectedCampaignId(String(v))}
              >
                <SelectTrigger className="w-full md:w-64" aria-label="Campaign">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c: Campaign) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title ?? c.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Phase select */}
          <div>
            <label className="text-sm block mb-1">Phase</label>
            <Select
              value={selectedPhase}
              onValueChange={(v) => setSelectedPhase(v as Phase)}
            >
              <SelectTrigger className="w-full md:w-36" aria-label="Phase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHASES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Survey select */}
          <div>
            <label className="text-sm block mb-1">Survey</label>
            {surveysForPhase.length === 0 ? (
              <div className="w-64 h-10 rounded border bg-slate-50 flex items-center px-3">
                No surveys for this phase
              </div>
            ) : (
              <Select
                value={selectedSurveyId ?? ''}
                onValueChange={(v) => setSelectedSurveyId(String(v))}
              >
                <SelectTrigger className="w-full md:w-64" aria-label="Survey">
                  <SelectValue placeholder="Select survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveysForPhase.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title ?? s.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <section>
          <h1 className="text-xl font-semibold">Responses</h1>

          {isLoading ? (
            <div>Loading campaigns...</div>
          ) : isError ? (
            <div className="text-rose-600">Failed to load campaigns</div>
          ) : surveysForPhase.length === 0 ? (
            <div className="text-muted-foreground">
              No surveys found for selected campaign and phase.
            </div>
          ) : !selectedSurveyId ? (
            <div className="text-muted-foreground">
              Select a survey to view responses.
            </div>
          ) : isResponsesLoading ? (
            <div>Loading responses...</div>
          ) : isResponsesError ? (
            <div className="text-rose-600">Failed to load responses</div>
          ) : responses.length === 0 ? (
            <div className="text-muted-foreground">
              No responses for this survey.
            </div>
          ) : (
            <ResponsesTable responses={responses} />
          )}
        </section>
      </div>
    </div>
  );
}
