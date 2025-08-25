import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DefaultInfoSection from '@/components/DefaultInfoSection';
import QuestionBlock from '@/components/QuestionBlock';
import SurveyPreview from '@/components/SurveyPreview';
import type { Question, QuestionType } from '@/utils/surveyUtils';
import { uid } from '@/utils/surveyUtils';
import { Card } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SurveyBuilderProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

// Query instead
const surveys = [
  {
    id: '1',
    title: 'Survey 1',
    form: '{json stringified here}',
  },
  {
    id: '2',
    title: 'Survey 2',
    form: '{json stringified here}',
  },
  {
    id: '3',
    title: 'Survey 3',
    form: '{json stringified here}',
  },
];

export default function SurveyBuilderPage({
  questions,
  setQuestions,
}: SurveyBuilderProps) {
  const [surveyTitle, setSurveyTitle] = useState<string>('Pre-Campaign Survey');
  const [defaultInfo, setDefaultInfo] = useState<Record<string, string>>({});
  const [survey, setSurvey] = useState('');

  // Set first survey as the default survey to display
  useEffect(() => {
    if (surveys) {
      setSurvey(surveys[0].id);
    }
  }, []);

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
    <div className="mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2 p-4">
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="col-span-2">
                <h1 className="text-2xl font-bold">Survey Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Create and edit survey for a campaign phase
                </p>
              </div>

              <div className="flex flex-wrap items-start md:items-center gap-2">
                <div className="w-full">
                  <Select value={survey} onValueChange={(s) => setSurvey(s)}>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {surveys.map((s) => (
                        <SelectItem value={s.id} className="cursor-pointer">
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full flex-wrap gap-2">
                  <Button
                    onClick={() => alert('Add New Survey')}
                    variant="secondary"
                    className="cursor-pointer flex-1"
                  >
                    <Plus />
                    Add Survey
                  </Button>
                  <Button
                    onClick={saveSurvey}
                    variant="default"
                    className="cursor-pointer flex-1"
                  >
                    <Save />
                    Save Survey
                  </Button>
                </div>
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
                <Plus />
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
                  <Plus />
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
