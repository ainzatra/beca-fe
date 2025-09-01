import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DefaultInfoSection from '@/components/DefaultInfoSection';
import PublicQuestionBlock from '@/components/PublicQuestionBlock';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import QuestionBlock from '@/components/QuestionBlock';
import SurveyPreview from '@/components/SurveyPreview';
import type { Question, QuestionType } from '@/utils/surveyUtils';
import { uid } from '@/utils/surveyUtils';
import { Card } from '@/components/ui/card';
import {
  CircleCheck,
  CircleCheckBig,
  FileLock,
  Lock,
  Plus,
  Save,
  Trash,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreateSurveySheet from '@/components/CreateSurveySheet';
import type { CampaignPhase } from '@/components/CampaignCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/utils';
import { toast } from 'sonner';

export interface Survey {
  id: string;
  title: string;
  form: string;
  createdAt: string;
  phase: CampaignPhase;
}

export interface UpdateSurvey {
  title: string;
  form: string;
}

export interface SurveyList {
  id: string;
  title: string;
  phase: CampaignPhase;
}

interface SurveyBuilderProps {
  surveys: SurveyList[];
  phase: CampaignPhase;
  campaignId: string;
}

export default function SurveyBuilderPage({
  surveys,
  phase,
  campaignId,
}: SurveyBuilderProps) {
  const [surveyTitle, setSurveyTitle] = useState<string>('Pre-Campaign Survey');
  const [defaultInfo, setDefaultInfo] = useState<Record<string, string>>({});
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // Set first survey as the default survey to display
  useEffect(() => {
    if (surveys && surveys.length > 0) {
      setSelectedSurvey(surveys[0].id);
    }
  }, [surveys]);

  const {
    data: survey,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['survey', selectedSurvey],
    queryFn: async () => {
      const response = await api(`/survey/${selectedSurvey}`, true);

      if (!response.ok) {
        throw new Error('Failed to fetch survey');
      }
      const result = await response.json();
      return result;
    },
    enabled: !!selectedSurvey,
  });

  // Sync fetched survey into local state when it arrives
  useEffect(() => {
    if (!survey) return;
    console.log(survey.form);
    const parsedForm = JSON.parse(survey.form);
    setQuestions(parsedForm);
    setSurveyTitle(survey.title);
    setIsFinalized(Boolean(survey.isFinalized));
  }, [survey]);

  const saveMutation = useMutation({
    mutationFn: async (payload: UpdateSurvey) => {
      console.log('Update payload:', payload);
      await api(`/survey/${survey.id}`, true, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      toast.success('Survey saved successfully.', {
        style: {
          backgroundColor: 'limegreen',
          color: 'white',
        },
      });

      queryClient.invalidateQueries({ queryKey: ['survey', selectedSurvey] });
      queryClient.invalidateQueries({
        queryKey: ['surveys', phase, campaignId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api(`/survey/${survey.id}`, true, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast.success('Survey deleted successfully.', {
        style: {
          backgroundColor: 'crimson',
          color: 'white',
        },
      });

      // After deletion, pick the next available survey if any, otherwise clear selection
      const remaining = (surveys || []).filter((s) => s.id !== survey.id);
      setSelectedSurvey(remaining[0]?.id ?? '');

      queryClient.invalidateQueries({
        queryKey: ['surveys', phase, campaignId],
      });
      queryClient.invalidateQueries({ queryKey: ['survey', selectedSurvey] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to delete survey');
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: async (payload: { isFinalized: boolean }) => {
      if (!survey?.id) throw new Error('No survey selected');
      await api(`/survey/${survey.id}`, true, {
        method: 'PUT',
        body: JSON.stringify({ isFinalized: payload.isFinalized }),
      });
    },
    onSuccess: (_res, variables) => {
      // Set finalized to the value we requested. Prevents toggling back unintentionally.
      setIsFinalized(Boolean(variables?.isFinalized));
      toast.success('Survey finalized status updated.', {
        style: {
          backgroundColor: 'limegreen',
          color: 'white',
        },
      });
      queryClient.invalidateQueries({ queryKey: ['survey', selectedSurvey] });
      queryClient.invalidateQueries({
        queryKey: ['surveys', phase, campaignId],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to update finalized status');
    },
  });

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
      form: JSON.stringify(questions),
    };
    saveMutation.mutate(payload);
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
                  <Select
                    value={selectedSurvey}
                    onValueChange={(s) => {
                      setSelectedSurvey(s);
                    }}
                  >
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(surveys || []).map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                          className="cursor-pointer"
                        >
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full flex-wrap gap-2 items-center">
                  <div className="flex-1">
                    <CreateSurveySheet phase={phase} campaignId={campaignId} />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        if (!survey?.id) {
                          toast.error('No survey selected');
                          return;
                        }
                        if (
                          !confirm(
                            'Are you sure you want to delete this survey? This action cannot be undone.',
                          )
                        )
                          return;
                        deleteMutation.mutate();
                      }}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash />
                      Delete Survey
                    </Button>
                  </div>
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
                disabled={isFinalized}
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
              {questions.map((q, idx) =>
                isFinalized ? (
                  <PublicQuestionBlock
                    key={q.id}
                    q={q}
                    value={undefined}
                    onChange={() => {
                      /* read-only in builder when finalized */
                    }}
                  />
                ) : (
                  <QuestionBlock
                    key={q.id}
                    q={q}
                    index={idx}
                    onUpdate={(next) => updateQuestion(q.id, next)}
                    onRemove={() => removeQuestion(q.id)}
                    onMoveUp={() => moveQuestion(q.id, 'up')}
                    onMoveDown={() => moveQuestion(q.id, 'down')}
                  />
                ),
              )}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2">
                <Button
                  onClick={() => addQuestion()}
                  variant="secondary"
                  className="cursor-pointer w-full sm:w-max"
                  disabled={isFinalized}
                >
                  <Plus />
                  Add Question
                </Button>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-max">
                  <Button
                    onClick={() => {
                      if (!survey?.id) {
                        toast.error('No survey selected');
                        return;
                      }
                      saveSurvey();
                    }}
                    variant="default"
                    className="cursor-pointer w-full sm:w-max"
                    disabled={isFinalized}
                  >
                    <Save />
                    Save Survey
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="border border-accent w-full sm:w-max"
                        disabled={isFinalized}
                      >
                        <CircleCheckBig />
                        Finalize Survey
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Finalize Survey</AlertDialogTitle>
                        <AlertDialogDescription>
                          Finalizing will lock the survey and prevent further
                          edits. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (!survey?.id) {
                              toast.error('No survey selected');
                              return;
                            }
                            finalizeMutation.mutate({ isFinalized: true });
                          }}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
