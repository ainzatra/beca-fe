import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Question } from '@/utils/surveyUtils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SurveyPreviewProps = {
  title: string;
  defaultInfo: Record<string, string>;
  questions: Question[];
};

export default function SurveyPreview({
  title,
  defaultInfo,
  questions,
}: SurveyPreviewProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>
          How the survey will look for respondents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {title || 'Untitled Survey'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Preview of respondent information and questions
          </p>
        </div>

        <div className="mb-3 space-y-2">
          <div className="text-sm font-medium">Respondent Info</div>
          <div className="text-xs text-muted-foreground">
            {defaultInfo.name ? `Name: ${defaultInfo.name}` : 'Name: —'} •{' '}
            {defaultInfo.contact
              ? `Contact: ${defaultInfo.contact}`
              : 'Contact: —'}
            {defaultInfo.address ? ` • Address: ${defaultInfo.address}` : ''}
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="p-3 border rounded-md bg-background">
              <div className="flex items-start gap-2 justify-between">
                <div className="font-medium text-wrap">
                  {q.title || 'Untitled question'}
                </div>
                {q.required && <Badge variant="destructive">Required</Badge>}
              </div>

              <div className="mt-2">
                {q.type === 'text' && <Input placeholder="Answer" />}
                {q.type === 'textarea' && (
                  <textarea
                    className="w-full rounded-md border p-2 min-h-[80px]"
                    placeholder="Answer"
                  />
                )}
                {q.type === 'radio' && (
                  <div className="flex flex-col gap-1 mt-2">
                    {q.options.length === 0 ? (
                      <div className="text-xs text-muted-foreground">
                        No options
                      </div>
                    ) : (
                      q.options.map((o, i) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="radio" name={q.id} />
                          <span>{o}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
                {q.type === 'checkbox' && (
                  <div className="flex flex-col gap-1 mt-2">
                    {q.options.length === 0 ? (
                      <div className="text-xs text-muted-foreground">
                        No options
                      </div>
                    ) : (
                      q.options.map((o, i) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span>{o}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
