import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Brush,
} from 'recharts';
import {
  COLORS,
  formatCandidateName,
  type VotesPerLocationChartProps,
} from './ElectionShared';

function VotesPerLocationChart({ votes }: VotesPerLocationChartProps) {
  const [selectedLocation, setSelectedLocation] = useState('all');

  const locations = Object.keys(votes);
  const allCandidates = Array.from(
    new Set(locations.flatMap((location) => Object.keys(votes[location]))),
  );

  let chartData: any[] = [];
  let chartConfig: any = {};
  let xItems = 0;
  let dataKey = '';

  if (selectedLocation === 'all') {
    // Show all locations: grouped bars per location
    chartData = locations.map((location) => {
      const dataPoint: any = { location };
      allCandidates.forEach((candidate) => {
        dataPoint[candidate] = votes[location][candidate] || 0;
      });
      return dataPoint;
    });

    chartConfig = allCandidates.reduce(
      (config, candidate, index) => {
        config[candidate] = {
          label: formatCandidateName(candidate),
          color: COLORS[index % COLORS.length],
        };
        return config;
      },
      {} as Record<string, { label: string; color: string }>,
    );
    xItems = locations.length;
    dataKey = 'location';
  } else {
    // Show single location: bars per candidate
    const candidates = Object.keys(votes[selectedLocation]);
    chartData = candidates.map((candidate, index) => ({
      candidate: formatCandidateName(candidate),
      votes: votes[selectedLocation][candidate],
      fill: COLORS[index % COLORS.length],
    }));

    chartConfig = candidates.reduce(
      (config, candidate, index) => {
        config[candidate] = {
          label: formatCandidateName(candidate),
          color: COLORS[index % COLORS.length],
        };
        return config;
      },
      {} as Record<string, { label: string; color: string }>,
    );
    xItems = candidates.length;
    dataKey = 'candidate';
  }

  const minBarWidth = 40;
  const chartWidth = Math.max(600, xItems * minBarWidth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votes Per Candidate Per Location</CardTitle>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Location</label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <BarChart
            data={chartData}
            barCategoryGap="20%"
            // margin={{ bottom: 80 }}
          >
            <XAxis
              dataKey={dataKey}
              // angle={-45}
              // textAnchor="end"
              tickFormatter={(value) =>
                value.length > 15 ? value.substring(0, 15) + '...' : value
              }
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            {selectedLocation === 'all' ? (
              allCandidates.map((candidate) => (
                <Bar
                  key={candidate}
                  dataKey={candidate}
                  fill={chartConfig[candidate].color}
                />
              ))
            ) : (
              <Bar dataKey="votes">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            )}
            <Brush dataKey={dataKey} height={30} stroke="#8884d8" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default VotesPerLocationChart;
