import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export type SummaryPanelProps = {
  summary: string;
};

export default function SummaryPanel({ data }: { data: SummaryPanelProps }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm text-foreground text-justify text-wrap">
          {data.summary}
        </pre>
      </CardContent>
    </Card>
  );
}
