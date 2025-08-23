import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DefaultInfoSection from '@/components/DefaultInfoSection';
import QuestionBlock from '@/components/QuestionBlock';
import SurveyPreview from '@/components/SurveyPreview';
import type { Question, QuestionType } from '@/utils/surveyUtils';
import { uid } from '@/utils/surveyUtils';
import { Card } from '@/components/ui/card';

interface SurveyBuilderProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}
export default function SurveyBuilderPage({
  questions,
  setQuestions,
}: SurveyBuilderProps) {
  const [surveyTitle, setSurveyTitle] = useState<string>('Pre-Campaign Survey');
  const [defaultInfo, setDefaultInfo] = useState<Record<string, string>>({});

  const addQuestion = (type: QuestionType = 'text') => {
    const q: Question = {
      id: uid('q_'),
      title: '',
      type,
      required: false,
      options:
        type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : [],
    };
    setQuestions((s) => [...s, q]);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((s) => s.filter((q) => q.id !== id));
  };

  const moveQuestion = (id: string, dir: 'up' | 'down') => {
    setQuestions((s) => {
      const idx = s.findIndex((q) => q.id === id);
      if (idx === -1) return s;
      const target = dir === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= s.length) return s;
      const next = [...s];
      const tmp = next[target];
      next[target] = next[idx];
      next[idx] = tmp;
      return next;
    });
  };

  const saveSurvey = () => {
    const payload = {
      title: surveyTitle,
      defaultInfo,
      questions,
      updatedAt: new Date().toISOString(),
    };
    // For demo we store locally and log
    localStorage.setItem('demo_survey', JSON.stringify(payload));
    console.log('Saved survey (demo):', payload);
    alert('Survey saved to localStorage (demo). Check console for payload.');
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Survey Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Create and edit survey for a campaign phase
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={saveSurvey}
                  variant="default"
                  className="cursor-pointer"
                >
                  Save Survey
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <Label className="mb-2">Survey Title</Label>
            <Input
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
            />
          </div>

          <DefaultInfoSection values={defaultInfo} onChange={setDefaultInfo} />

          <div>
            <div className=" flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold mb-2">
                <span>Questions</span>
              </h2>

              <Button
                variant="secondary"
                onClick={() => addQuestion()}
                className="cursor-pointer"
              >
                Add Question
              </Button>
            </div>
            <div>
              {questions.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No questions yet. Use the Add Question button to add one.
                </div>
              )}
              {questions.map((q, idx) => (
                <QuestionBlock
                  key={q.id}
                  q={q}
                  index={idx}
                  onUpdate={(next) => updateQuestion(q.id, next)}
                  onRemove={() => removeQuestion(q.id)}
                  onMoveUp={() => moveQuestion(q.id, 'up')}
                  onMoveDown={() => moveQuestion(q.id, 'down')}
                />
              ))}
              <div className="mt-4">
                <Button
                  onClick={() => addQuestion()}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="">
          <SurveyPreview
            title={surveyTitle}
            defaultInfo={defaultInfo}
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
