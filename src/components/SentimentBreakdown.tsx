import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SentimentBreakdown({ data }) {
  const total = Math.max(1, data.report.totalResponses);
  const positivePct = Math.round((data.report.positive / total) * 100);
  const neutralPct = Math.round((data.report.neutral / total) * 100);
  const negativePct = Math.round((data.report.negative / total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around h-48">
          <div className="text-center">
            <div className="text-lg font-semibold">{positivePct}%</div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{neutralPct}%</div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{negativePct}%</div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
