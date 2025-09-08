import CampaignHeader from '@/components/CampaignHeader';
import PhaseCard from '@/components/PhaseCard';
import PrescriptivePanel from '@/components/PrescriptivePanel';
import type { Campaign, CampaignPhase } from '@/components/CampaignCard';
import type { Question } from '@/utils/surveyUtils';
import { Card } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';
import type { Survey } from './SurveyBuilderPage';
import { checkPhasesCompleted } from '@/utils/utils';

export interface Response {
  id: string;
  name: string;
  address: string;
  phone: string;
  valid_id: string;
  data: string;
}

export interface PhaseTotals {
  surveys: number;
  responses: number;
}

export interface CampaignDetails extends Campaign {
  updatedAt: string;
  surveys: Survey[];
  _count: {
    surveys: number;
  };
  totalsByPhase: {
    PRE: PhaseTotals;
    MID: PhaseTotals;
    POST: PhaseTotals;
  };
}

const phases = ['PRE', 'MID', 'POST'];
export default function CampaignDetailPage({
  campaign,
  isLoading,
  isError,
}: {
  campaign: CampaignDetails;
  isLoading: boolean;
  isError: boolean;
}) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // useEffect(() => {
  //   // Simulate fetching campaign data. Replace with real API call.
  //   setLoading(true);
  //   const timer = setTimeout(() => {
  //     const initial: Campaign = {
  //       id: campaignId,
  //       title: `Campaign Title`,
  //       status: 'active',
  //       description: 'Example campaign detail generated for preview purposes.',
  //       phasesCompleted: 1,
  //       createdAt: new Date().toISOString(),
  //     };
  //     setCampaign(initial);
  //     setCurrentPhaseIndex(
  //       Math.max(0, Math.min(2, (initial.phasesCompleted ?? 0) - 1)),
  //     );
  //     setLoading(false);
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, [campaignId]);

  if (isLoading || !campaign) {
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

  return (
    <div className="mx-auto gap-4">
      <Card className="lg:col-span-2 space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CampaignHeader campaign={campaign} />
          </div>
        </div>

        <section aria-labelledby="phases-heading" className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 id="phases-heading" className="text-lg font-semibold">
              Phases
            </h3>
            <div className="text-sm text-muted-foreground">
              {checkPhasesCompleted(campaign.activePhase, campaign.status)} / 3
              complete
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phases.map((p) => (
              <PhaseCard
                key={p}
                phase={p as CampaignPhase}
                status={campaign.activePhase === p ? 'active' : 'inactive'}
                total={campaign.totalsByPhase[p as CampaignPhase]}
                campaignId={campaign.id}
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

      {/* <aside className="space-y-4">
          <SurveyPreview
            title="Sample Survey Preview"
            defaultInfo={{ name: '', contact: '' }}
            questions={sampleQuestions}
          />
        </aside> */}
    </div>
  );
}
