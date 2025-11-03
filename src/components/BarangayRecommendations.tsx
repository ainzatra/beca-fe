import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Recommendation = {
  barangay: string;
  recommendation: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  sentimentScore: number;
  historicalPerformance: string;
  keyIssues: string[];
  responseCount: number;
};

type BarangayRecommendationsProps = {
  data: {
    report: {
      recommendations?: Recommendation[];
    };
  };
};

export default function BarangayRecommendations({
  data,
}: BarangayRecommendationsProps) {
  const [selectedBarangay, setSelectedBarangay] = useState<string>('');

  const recommendations = data.report.recommendations || [];

  // Extract barangay options for dropdown
  const barangayOptions = recommendations.map((rec) => ({
    value: rec.barangay,
    label: rec.barangay,
    priority: rec.priority,
  }));

  // Sort alphabetically for better UX
  barangayOptions.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  // Find selected recommendation
  const selectedRecommendation = recommendations.find(
    (rec) => rec.barangay === selectedBarangay,
  );

  // Set first barangay as default if available
  if (barangayOptions.length > 0 && !selectedBarangay) {
    setSelectedBarangay(barangayOptions[0].value);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Barangay Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No barangay recommendations available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Barangay Recommendations</CardTitle>
          <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a barangay" />
            </SelectTrigger>
            <SelectContent>
              {barangayOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {/* <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(option.priority)}`}
                    >
                      {option.priority}
                    </Badge> */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommendation Details */}
        {selectedRecommendation && (
          <div className="space-y-4 border-t pt-4">
            {/* Priority Badge */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {selectedRecommendation.barangay}
              </h3>
              {/* <Badge
                variant="outline"
                className={getPriorityColor(selectedRecommendation.priority)}
              >
                {selectedRecommendation.priority} PRIORITY
              </Badge> */}
            </div>

            {/* Recommendation Text */}
            <div>
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm text-muted-foreground text-justify">
                {selectedRecommendation.recommendation}
              </p>
            </div>

            {/* Data Quality Indicator */}
            <div className="text-xs text-muted-foreground border-t pt-2">
              Based on {selectedRecommendation.responseCount} survey responses
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
