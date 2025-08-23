import PrescriptivePanel from '@/components/PrescriptivePanel';
import StatCard from '@/components/StatCard';
import { ProgressCard } from '@/components/ProgressCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export function DashboardPage() {
  const stats = {
    totalResponses: 5,
    awareness: 3,
    support: 2,
    surveyors: 3,
  };

  return (
    <div className="bg-white rounded-xl p-4 space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-white p-4 shadow-md">
        <div className="font-medium">Current Phase: Pre-Campaign Survey</div>
        <div className="text-sm">Day 5 of 45</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          value={stats.totalResponses}
          title="Total Responses"
          subtitle={
            <div className="text-xs">
              📈 +0 today • Pre: 5 • Mid: 0 • Post: 0
            </div>
          }
          className="bg-gradient-to-br from-blue-700 to-emerald-500"
        />
        <StatCard
          value={stats.awareness}
          title="Candidate Awareness (67%)"
          subtitle={
            <div className="text-xs">
              📊 60% this week • Based on all phases
            </div>
          }
          className="bg-gradient-to-br from-blue-700 to-emerald-500"
        />
        <StatCard
          value={stats.support}
          title="Support Count (43%)"
          subtitle={
            <div className="text-xs">⬆️ 40% this week • Combined analysis</div>
          }
          className="bg-gradient-to-br from-blue-700 to-emerald-500"
        />
      </div>

      <div className="w-1/3">
        <StatCard
          value={stats.surveyors}
          title="Active Surveyors"
          subtitle={
            <div className="text-xs">🟢 3 active • Across all phases</div>
          }
          className="bg-gradient-to-br from-blue-700 to-emerald-500"
        />
      </div>

      <PrescriptivePanel />

      <Card>
        <CardHeader>
          <CardTitle>📈 Real-time Campaign Progress</CardTitle>
          <CardDescription>
            Live overview of responses per phase
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <ProgressCard
              title="📊 Pre-Campaign Phase"
              count={5}
              from="#10b981"
              to="#059669"
            />
            <ProgressCard
              title="🎯 Mid-Campaign Phase"
              count={0}
              from="#fb923c"
              to="#f97316"
            />
            <ProgressCard
              title="📦 Post-Election Phase"
              count={0}
              from="#8b5cf6"
              to="#6d28d9"
            />
          </div>

          <div className="bg-slate-50 rounded-md p-3 border">
            <div className="font-semibold">💬 Live Updates</div>
            <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">
                  Last Survey:
                </div>
                <div className="font-medium">Carmen Lopez (PRE CAMPAIGN)</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Today's Total:
                </div>
                <div className="font-medium">0</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">This Week:</div>
                <div className="font-medium">0</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Overall Trend:
                </div>
                <div className="font-medium">Stable</div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-3">
            <button className="px-3 py-2 rounded-md bg-slate-200">
              Export CSV
            </button>
            <button className="px-3 py-2 rounded-md border">
              Open Reports
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
