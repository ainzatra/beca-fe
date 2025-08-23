import Header from '@/components/Header';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { uid, type Question } from '@/utils/surveyUtils';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute(
  '/campaigns/$campaignId/phases/$phaseId/survey',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { phaseId } = Route.useParams();
  // Use surveyId when calling backend to fetch the survey questions and store in questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uid('q_'),
      title: 'How likely are you to vote in the upcoming election?',
      type: 'radio',
      required: true,
      options: ['Very likely', 'Somewhat likely', 'Unlikely', 'Not sure'],
    },
    {
      id: uid('q_'),
      title: 'Who do you currently support? (optional)',
      type: 'text',
      required: false,
      options: [],
    },
  ]);
  console.log(questions);

  return (
    <div>
      <Header />
      <SurveyBuilderPage questions={questions} setQuestions={setQuestions} />
    </div>
  );
}
