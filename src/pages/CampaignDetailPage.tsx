import * as React from 'react';
import CampaignHeader from '@/components/CampaignHeader';
import PhaseCard from '@/components/PhaseCard';
import SurveyPreview from '@/components/SurveyPreview';
import PrescriptivePanel from '@/components/PrescriptivePanel';
import type { Campaign } from '@/components/CampaignCard';
import type { Question } from '@/utils/surveyUtils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CampaignManagementSheet from '@/components/CampaignManagementSheet';
import { useEffect, useMemo, useState } from 'react';

export default function CampaignDetailPage({
  campaignId,
}: {
  campaignId: string;
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    // Simulate fetching campaign data. Replace with real API call.
    setLoading(true);
    const timer = setTimeout(() => {
      const initial: Campaign = {
        id: campaignId,
        title: `Campaign Title`,
        status: 'active',
        description: 'Example campaign detail generated for preview purposes.',
        phasesCompleted: 1,
        createdAt: new Date().toISOString(),
      };
      setCampaign(initial);
      setCurrentPhaseIndex(
        Math.max(0, Math.min(2, (initial.phasesCompleted ?? 0) - 1)),
      );
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [campaignId]);

  function capitalizeStatus(s: string | undefined) {
    if (!s) return 'Draft';
    const map: Record<string, 'Draft' | 'Active' | 'Paused' | 'Completed'> = {
      draft: 'Draft',
      active: 'Active',
      paused: 'Paused',
      completed: 'Completed',
    };
    return map[s.toLowerCase()] ?? 'Draft';
  }

  // sample phases (kept at top so hooks order is stable)
  const basePhases = useMemo(() => {
    const id = campaign?.id ?? 'temp';
    return [
      {
        id: `${id}-pre`,
        name: 'Pre-Campaign',
        description: 'Baseline awareness and sentiment before campaigning.',
        responses: campaign ? 52 : 0,
      },
      {
        id: `${id}-mid`,
        name: 'Mid-Campaign',
        description: 'Measure changes mid-campaign to inform tactics.',
        responses: 0,
      },
      {
        id: `${id}-post`,
        name: 'Post-Campaign',
        description: 'Final outcomes and voting intention after campaign.',
        responses: 0,
      },
    ];
  }, [campaign?.id]);

  if (loading || !campaign) {
    return (
      <div>
        <main className="max-w-7xl mx-auto p-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-48 bg-slate-200 rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // derive statuses for display from currentPhaseIndex (completed -> active -> pending)
  const derivedPhases = basePhases.map((p, idx) => {
    const status =
      idx < currentPhaseIndex
        ? 'completed'
        : idx === currentPhaseIndex
          ? 'active'
          : 'pending';
    return { ...p, status, index: idx };
  });

  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      title: 'How aware are you of the candidate?',
      type: 'radio',
      required: true,
      options: ['Not aware', 'Somewhat', 'Very'],
    },
    {
      id: 'q2',
      title: 'Do you plan to vote for the candidate?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'Undecided'],
    },
  ];

  return (
    <div>
      <div className=" mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 space-y-4 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CampaignHeader
                campaign={campaign}
                onRunAnalysis={() => {
                  // eslint-disable-next-line no-alert
                  alert('Running prescriptive analysis...');
                }}
              />
            </div>
          </div>

          <section aria-labelledby="phases-heading" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 id="phases-heading" className="text-lg font-semibold">
                Phases
              </h3>
              <div className="text-sm text-muted-foreground">
                {campaign.phasesCompleted ?? 0} / 3 complete
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {derivedPhases.map((p) => (
                <PhaseCard
                  key={p.id}
                  campaignId={campaign.id}
                  phaseId={p.id}
                  title={p.name}
                  status={
                    p.status === 'active'
                      ? 'active'
                      : p.status === 'completed'
                        ? 'completed'
                        : 'draft'
                  }
                  responses={p.responses}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="analysis-heading" className="mt-4">
            <h3 id="analysis-heading" className="text-lg font-semibold mb-2">
              Prescriptive Analysis
            </h3>
            <PrescriptivePanel />
          </section>
        </Card>

        <aside className="space-y-4">
          <SurveyPreview
            title="Sample Survey Preview"
            defaultInfo={{ name: '', contact: '' }}
            questions={sampleQuestions}
          />
        </aside>
      </div>
    </div>
  );
}
