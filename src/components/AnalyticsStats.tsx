import StatCard from '@/components/StatCard';

export type AnalyticsData = {
  totalResponses: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence?: number;
  topIssues?: any[];
};

export default function AnalyticsStats({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        value={data.totalResponses}
        title="Total Responses"
        subtitle={<div className="text-xs">Across selected campaign</div>}
        className="bg-gradient-to-br from-blue-700 to-emerald-500"
      />

      <StatCard
        value={data.positive}
        title="Positive Sentiment"
        subtitle={<div className="text-xs">Based on AI sentiment</div>}
        className="bg-gradient-to-br from-emerald-600 to-emerald-400"
      />

      <StatCard
        value={data.negative}
        title="Negative Sentiment"
        subtitle={<div className="text-xs">Issues & concerns</div>}
        className="bg-gradient-to-br from-red-600 to-rose-500"
      />
    </div>
  );
}
