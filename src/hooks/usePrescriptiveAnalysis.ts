import React from 'react';

export type Recommendation = {
  id: string;
  text: string;
  confidence: number; // 0-100
  rationale?: string;
  action?: string;
};

export type PrescriptiveResult = {
  recommendations: Recommendation[];
  overallConfidence: number;
  generatedAt: string;
};

/**
 * Mocked prescriptive analysis hook
 *
 * - runAnalysis(opts) simulates a remote call and returns deterministic recommendations after a short delay.
 * - data is null until runAnalysis completes.
 *
 * Replace with real API/TanStack Query integration later.
 */
export default function usePrescriptiveAnalysis() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<PrescriptiveResult | null>(null);

  const runAnalysis = (opts?: { campaignId?: string; dateRange?: string }) => {
    setLoading(true);
    setData(null);

    // Mocked analysis delay
    const timeout = 600;

    setTimeout(() => {
      const now = new Date().toISOString();
      const result: PrescriptiveResult = {
        overallConfidence: 76,
        generatedAt: now,
        recommendations: [
          {
            id: 'r1',
            text: 'Increase door-to-door visits in Districts 3 and 5 focused on healthcare messaging.',
            confidence: 82,
            rationale:
              'Negative sentiment on healthcare and low reach in those districts.',
            action:
              'Assign 5 surveyors to District 3 and 5 for the next 7 days.',
          },
          {
            id: 'r2',
            text: 'Run a short follow-up SMS survey targeting 18-35 age group to validate messaging.',
            confidence: 69,
            rationale:
              'Low sample from younger demographics in current responses.',
            action: 'Create a follow-up survey and send via SMS channel.',
          },
          {
            id: 'r3',
            text: 'A/B test two message variants emphasizing infrastructure vs. healthcare next week.',
            confidence: 64,
            rationale:
              'Top issues show mixed sentiment; A/B will surface higher resonance.',
            action: 'Prepare two message drafts and run A/B for 72 hours.',
          },
        ],
      };

      setData(result);
      setLoading(false);
    }, timeout);
  };

  const clear = () => setData(null);

  return {
    data,
    loading,
    runAnalysis,
    clear,
  } as const;
}
