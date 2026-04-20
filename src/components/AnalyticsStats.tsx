import StatCard from '@/components/StatCard';

export type AnalyticsData = {
  totalResponses: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence?: number;
  topIssues?: any[];
};

export default function AnalyticsStats({ data }) {
  const report = data.report;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        value={report.totalResponses}
        title="Total Responses"
        subtitle={<div className="text-xs">Across selected campaign</div>}
        accentColor="blue"
      />

      <StatCard
        value={report.positive}
        title="Positive Sentiment"
        subtitle={<div className="text-xs">Based on AI sentiment</div>}
        accentColor="emerald"
      />

      <StatCard
        value={report.negative}
        title="Negative Sentiment"
        subtitle={<div className="text-xs">Issues & concerns</div>}
        accentColor="red"
      />
    </div>
  );
}
