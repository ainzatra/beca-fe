import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { createFileRoute } from '@tanstack/react-router';
import type { Question } from '@/utils/surveyUtils';
import PublicQuestionBlock from '@/components/PublicQuestionBlock';
import SurveyPreview from '@/components/SurveyPreview';
import { api } from '@/utils/utils';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Route = createFileRoute('/survey/$surveyId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { surveyId } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<{
    id?: string;
    title?: string;
    defaultInfo?: Record<string, string>;
    questions?: Question[];
  }>({});
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [respondent, setRespondent] = useState({
    name: '',
    contact: '',
    address: '',
    idText: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (!surveyId) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await api(`/survey/public/${surveyId}`, false, {
          method: 'GET',
        });
        if (!res.ok) throw new Error(`Failed to load survey (${res.status})`);
        const body = await res.json();

        let questions: Question[] = [];
        if (Array.isArray(body.questions)) {
          questions = body.questions;
        } else if (typeof body.form === 'string') {
          try {
            questions = JSON.parse(body.form || '[]');
          } catch {
            questions = [];
          }
        } else if (Array.isArray(body.form)) {
          questions = body.form;
        }

        const defaultInfo = body.defaultInfo ?? { name: '', contact: '' };

        if (!mounted) return;
        setSurvey({
          id: body.id ?? surveyId,
          title: body.title ?? '',
          defaultInfo,
          questions,
        });

        const initial: Record<string, any> = {};
        questions.forEach((q: Question) => {
          initial[q.id] = q.type === 'checkbox' ? [] : '';
        });
        setAnswers(initial);
        setRespondent((r) => ({
          ...r,
          name: defaultInfo.name ?? '',
          contact: defaultInfo.contact ?? '',
        }));
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setError(err?.message ?? 'Failed to load survey');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [surveyId]);

  if (loading) {
    return (
      <div>
        {/* <Header /> */}
        <main className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-pulse text-lg font-medium">
                  Loading survey…
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Fetching survey details, please wait.
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {/* <Header /> */}
        <main className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-600">Error: {error}</div>
              <div className="text-xs text-muted-foreground mt-2">
                There was an issue loading this survey. Try refreshing the page.
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                If the problem persists, contact the administrator.
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div>
        {/* <Header /> */}
        <main className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thank you</CardTitle>
              <CardDescription>
                Your response has been recorded. We appreciate your time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                If you need to make another submission, refresh the page.
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Response recorded at {new Date().toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  const updateAnswer = (q: Question, val: any) =>
    setAnswers((s) => ({ ...s, [q.id]: val }));

  const validate = () => {
    // check personal info (required for now)
    if (
      !respondent.name.trim() ||
      !respondent.contact.trim() ||
      !respondent.address.trim() ||
      !respondent.idText.trim()
    ) {
      return {
        ok: false,
        message: 'Please fill up all your personal information',
      };
    }

    // check required questions
    for (const q of survey.questions ?? []) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (q.type === 'checkbox') {
        if (!Array.isArray(val) || val.length === 0) {
          return { ok: false, message: `Please answer: ${q.title}` };
        }
      } else {
        if (!val || `${val}`.trim() === '') {
          return { ok: false, message: `Please answer: ${q.title}` };
        }
      }
    }

    // honeypot
    if (honeypot.trim() !== '') return { ok: false, message: 'Spam detected' };

    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (!v.ok) {
      // show a toast and keep an inline error
      toast.error(v.message ?? 'Please fill up all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        surveyId: survey.id ?? surveyId,
        name: respondent.name,
        address: respondent.address,
        phone: respondent.contact,
        valid_id: respondent.idText,
        data: JSON.stringify(
          (survey.questions ?? []).map((q) => ({
            questionId: q.id,
            questionTitle: q.title,
            value: answers[q.id],
          })),
        ),
      };

      console.log('Form payload:', payload);
      const res = await api(`/response/${surveyId}`, false, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to submit (${res.status})`);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Submission failed. Try again later.');
      // setError(err?.message ?? 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* <Header /> */}
      <main className="max-w-4xl mx-auto p-6 flex gap-8">
        <section className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {survey.title ?? 'Survey'}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Please complete the personal information below, then answer the
                questions.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* honeypot */}
                <input
                  aria-hidden
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  name="hp_field"
                  style={{ display: 'none' }}
                />

                {/* Personal info */}
                <Card className="rounded-md">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="respondent_name" className="text-xs">
                          Name
                        </Label>
                        <Input
                          id="respondent_name"
                          className="mt-1"
                          value={respondent.name}
                          onChange={(e) =>
                            setRespondent((r) => ({
                              ...r,
                              name: (e.target as HTMLInputElement).value,
                            }))
                          }
                          placeholder="Full name"
                          name="respondent_name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="respondent_contact" className="text-xs">
                          Contact Number
                        </Label>
                        <Input
                          id="respondent_contact"
                          className="mt-1"
                          value={respondent.contact}
                          onChange={(e) =>
                            setRespondent((r) => ({
                              ...r,
                              contact: (e.target as HTMLInputElement).value,
                            }))
                          }
                          placeholder="Mobile or landline"
                          name="respondent_contact"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="respondent_address" className="text-xs">
                          Address
                        </Label>
                        <Input
                          id="respondent_address"
                          className="mt-1"
                          value={respondent.address}
                          onChange={(e) =>
                            setRespondent((r) => ({
                              ...r,
                              address: (e.target as HTMLInputElement).value,
                            }))
                          }
                          placeholder="Address"
                          name="respondent_address"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="respondent_id" className="text-xs">
                          ID Reference (for now, text)
                        </Label>
                        <Input
                          id="respondent_id"
                          className="mt-1"
                          value={respondent.idText}
                          onChange={(e) =>
                            setRespondent((r) => ({
                              ...r,
                              idText: (e.target as HTMLInputElement).value,
                            }))
                          }
                          placeholder="ID number or description"
                          name="respondent_id"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                <Card className="rounded-md">
                  <CardHeader>
                    <CardTitle className="text-sm">Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-2">
                      {(survey.questions ?? []).map((q) => (
                        <PublicQuestionBlock
                          key={q.id}
                          q={q}
                          value={answers[q.id]}
                          onChange={(v) => updateAnswer(q, v)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2"
                  >
                    {submitting ? 'Submitting…' : 'Submit'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // reset
                      setAnswers(
                        (survey.questions ?? []).reduce(
                          (acc, q) => {
                            acc[q.id] = q.type === 'checkbox' ? [] : '';
                            return acc;
                          },
                          {} as Record<string, any>,
                        ),
                      );
                      setRespondent({
                        name: '',
                        contact: '',
                        address: '',
                        idText: '',
                      });
                      setError(null);
                      toast('Form reset');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
