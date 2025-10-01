export interface ElectionData {
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

export const POSITIONS = [
  { value: 'mayor', label: 'Mayor' },
  { value: 'vice mayor', label: 'Vice Mayor' },
  { value: 'sangguniang bayan', label: 'Sangguniang Bayan' },
];

export const YEARS = ['2025', '2022', '2019'];

export const COLORS = [
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

export function formatCandidateName(name: string): string {
  // Title case the entire string
  const titleCased = name.replace(/\b\w/g, (l) => l.toUpperCase());
  // Uppercase text inside parentheses
  return titleCased.replace(
    /\((.*?)\)/g,
    (match, p1) => `(${p1.toUpperCase()})`,
  );
}

export interface ElectionControlsProps {
  position: string;
  year: string;
  onPositionChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export interface ElectionResultsDisplayProps {
  position: string;
  year: string;
}

export interface VotesPerLocationChartProps {
  votes: Record<string, Record<string, number>>;
}

export interface TotalVotesChartProps {
  votes: Record<string, Record<string, number>>;
}
