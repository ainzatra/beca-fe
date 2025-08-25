import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import type { Question } from '@/utils/surveyUtils';

export default function QuestionBlock({
  q,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  q: Question;
  index: number;
  onUpdate: (next: Question) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const updateField = (patch: Partial<Question>) =>
    onUpdate({ ...q, ...patch });

  return (
    <Card className="mb-3">
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-center lg:items-center items-start lg:justify-between w-full gap-4">
          <div className="w-full">
            <CardTitle className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium flex-none">
                {index + 1}.
              </span>
              <input
                className="bg-transparent font-semibold outline-none text-base w-full min-w-0"
                value={q.title}
                onChange={(e) => updateField({ title: e.target.value })}
                placeholder="Question title (e.g. How likely are you to vote?)"
              />
            </CardTitle>
            <CardDescription className="mt-1 text-xs truncate">
              Type: <span className="font-medium">{q.type}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 lg:flex-none">
            <QuestionTypeSelector
              value={q.type}
              onChange={(t) =>
                updateField({
                  type: t,
                  options: t === 'radio' || t === 'checkbox' ? q.options : [],
                })
              }
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <input
              id={`req-${q.id}`}
              type="checkbox"
              checked={q.required}
              onChange={(e) => updateField({ required: e.target.checked })}
              className="scale-105 cursor-pointer"
            />
            <Label htmlFor={`req-${q.id}`}>Required</Label>
          </div>

          {(q.type === 'radio' || q.type === 'checkbox') && (
            <div className="space-y-2">
              <Label>Options</Label>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...q.options];
                      next[i] = e.target.value;
                      updateField({ options: next });
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() =>
                      updateField({
                        options: q.options.filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() =>
                    updateField({
                      options: [...q.options, `Option ${q.options.length + 1}`],
                    })
                  }
                >
                  + Add option
                </Button>
                <div className="text-xs text-muted-foreground self-center">
                  Hint: use clear short labels
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={onMoveUp}>
            ↑
          </Button>
          <Button variant="outline" size="sm" onClick={onMoveDown}>
            ↓
          </Button>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
