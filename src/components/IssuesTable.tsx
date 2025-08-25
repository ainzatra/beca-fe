import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react';

export type Issue = {
  issue: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  mentions: number;
  trend: 'up' | 'down' | 'flat';
};

export default function IssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Issues & Performance</CardTitle>
        <CardDescription>
          Issues identified by AI and engagement metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Issue</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Mentions</TableHead>
              <TableHead>Trend</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {issues.map((it) => (
              <TableRow key={it.issue}>
                <TableCell>{it.issue}</TableCell>
                <TableCell>{it.sentiment}</TableCell>
                <TableCell>{it.mentions}</TableCell>
                <TableCell>
                  {it.trend === 'up' ? (
                    <TrendingUp />
                  ) : it.trend === 'down' ? (
                    <TrendingDown />
                  ) : (
                    <MoveRight />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Data confidence: TBD
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Download PDF
            </Button>
            <Button variant="default" size="sm">
              Schedule Report
            </Button>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
