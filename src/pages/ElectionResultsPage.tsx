import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/utils/utils';
import { toast } from 'sonner';

interface ElectionData {
  id: string;
  year: string;
  position: string;
  json: {
    year: string;
    votes: Record<string, Record<string, number>>;
    total_clusters: number;
  };
  createdAt: string;
}

const POSITIONS = [
  { value: 'mayor', label: 'Mayor' },
  { value: 'vice mayor', label: 'Vice Mayor' },
  { value: 'governor', label: 'Governor' },
  { value: 'sangguniang bayan', label: 'Sangguniang Bayan' },
];

const YEARS = ['2025', '2022', '2019', '2016'];

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
  '#ffb347',
  '#87ceeb',
  '#dda0dd',
  '#98fb98',
  '#f0e68c',
];

export default function ElectionResultsPage() {
  const [position, setPosition] = useState('mayor');
  const [year, setYear] = useState('2025');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Election Results</h1>

      <ElectionControls
        position={position}
        year={year}
        onPositionChange={setPosition}
        onYearChange={setYear}
      />

      <ElectionResultsDisplay position={position} year={year} />
    </div>
  );
}

interface ElectionControlsProps {
  position: string;
  year: string;
  onPositionChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

function ElectionControls({
  position,
  year,
  onPositionChange,
  onYearChange,
}: ElectionControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Position</label>
          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Select value={year} onValueChange={onYearChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

interface ElectionResultsDisplayProps {
  position: string;
  year: string;
}

function ElectionResultsDisplay({
  position,
  year,
}: ElectionResultsDisplayProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['election-results', position, year],
    queryFn: async () => {
      const response = await api(
        `/llm/history?position=${position}&year=${year}`,
        true,
      );
      if (!response.ok) {
        toast.error('Error fetching election data');
        throw new Error('Failed to fetch election data');
      }
      return response.json() as Promise<ElectionData[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Error loading election data. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            No election data available for the selected position and year.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Take the latest entry
  const latestData = data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const votes = latestData.json.votes;

  return (
    <div className="space-y-6">
      <VotesPerLocationChart votes={votes} />
      <TotalVotesChart votes={votes} />
    </div>
  );
}

interface VotesPerLocationChartProps {
  votes: Record<string, Record<string, number>>;
}

function VotesPerLocationChart({ votes }: VotesPerLocationChartProps) {
  const [selectedLocation, setSelectedLocation] = useState('all');

  const locations = Object.keys(votes);
  const allCandidates = Array.from(
    new Set(locations.flatMap((location) => Object.keys(votes[location]))),
  );

  let chartData: any[] = [];
  let chartConfig: any = {};

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
          label: candidate,
          color: COLORS[index % COLORS.length],
        };
        return config;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  } else {
    // Show single location: bars per candidate
    const candidates = Object.keys(votes[selectedLocation]);
    chartData = candidates.map((candidate, index) => ({
      candidate,
      votes: votes[selectedLocation][candidate],
      fill: COLORS[index % COLORS.length],
    }));

    chartConfig = candidates.reduce(
      (config, candidate, index) => {
        config[candidate] = {
          label: candidate,
          color: COLORS[index % COLORS.length],
        };
        return config;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  }

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
            margin={{ bottom: 80 }}
          >
            <XAxis
              dataKey={selectedLocation === 'all' ? 'location' : 'candidate'}
              angle={-45}
              textAnchor="end"
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
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface TotalVotesChartProps {
  votes: Record<string, Record<string, number>>;
}

function TotalVotesChart({ votes }: TotalVotesChartProps) {
  const totalVotes = Object.values(votes).reduce(
    (totals, locationVotes) => {
      Object.entries(locationVotes).forEach(([candidate, voteCount]) => {
        totals[candidate] = (totals[candidate] || 0) + voteCount;
      });
      return totals;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(totalVotes).map(([candidate, votes]) => ({
    candidate,
    votes,
  }));

  const chartConfig = {
    votes: {
      label: 'Votes',
      color: '#8884d8',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Votes Per Candidate</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="candidate"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
