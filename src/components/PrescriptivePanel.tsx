import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import usePrescriptiveAnalysis from '@/hooks/usePrescriptiveAnalysis';

export default function PrescriptivePanel() {
  const { data, loading, runAnalysis, clear } = usePrescriptiveAnalysis();
  const [showModal, setShowModal] = React.useState(false);

  const handleRun = () => {
    runAnalysis();
  };

  const lastUpdated = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString()
    : '—';

  return (
    <>
      <div className="w-full bg-primary rounded-xl p-6 text-white shadow-lg border-l-4 border-l-violet-500">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold">Prescriptive Analysis</h3>
            <p className="text-sm mt-1 text-white/90">
              Actionable recommendations generated from current analytics.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-md px-4 py-3 text-center">
                <div className="text-xs font-semibold">Overall confidence</div>
                <div className="text-sm mt-1">
                  {data ? `${data.overallConfidence}%` : '—'}
                </div>
              </div>

              <div className="bg-white/10 rounded-md px-4 py-3 text-center">
                <div className="text-xs font-semibold">Top recommendation</div>
                <div className="text-sm mt-1">
                  {data?.recommendations?.[0]?.text
                    ? data.recommendations[0].text.slice(0, 40) + '...'
                    : 'No recommendations yet'}
                </div>
              </div>

              <div className="bg-white/10 rounded-md px-4 py-3 text-center">
                <div className="text-xs font-semibold">Last run</div>
                <div className="text-sm mt-1">{lastUpdated}</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-white/80">
              Data: survey responses + sentiment & issue analysis
            </div>
            <div className="mt-2 text-sm text-emerald-300">
              ● Real-time data active
            </div>
          </div>

          <div className="flex flex-row md:flex-col flex-wrap gap-3">
            <Button
              variant="default"
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? 'Running…' : 'RUN PRESCRIPTIVE ANALYSIS'}
            </Button>

            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                clear();
              }}
            >
              Clear
            </Button>

            <Button
              variant="secondary"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => setShowModal(true)}
              disabled={!data}
            >
              View details
            </Button>
          </div>
        </div>

        {/* compact recommendations list */}
        <div className="mt-4">
          {loading && (
            <div className="text-sm text-white/80">
              Generating recommendations…
            </div>
          )}

          {!loading && data?.recommendations?.length ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.recommendations.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-white/10 p-3 rounded-md text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium">{r.text}</div>
                    <div className="text-xs text-white/80">{r.confidence}%</div>
                  </div>
                  <div className="text-xs text-white/70 mt-2">
                    {r.rationale}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal */}
      {showModal && data && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            'bg-black/40',
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  Prescriptive Recommendations
                </h3>
                <div className="text-sm text-muted-foreground">
                  Confidence: {data.overallConfidence}% • Generated:{' '}
                  {new Date(data.generatedAt).toLocaleString()}
                </div>
              </div>

              <div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {data.recommendations.map((r) => (
                <div key={r.id} className="p-3 border rounded">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{r.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.confidence}%
                    </div>
                  </div>
                  {r.rationale && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {r.rationale}
                    </div>
                  )}
                  {r.action && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          /* wire actions later */
                        }}
                      >
                        Apply suggestion
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
