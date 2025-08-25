import Header from '@/components/Header';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { uid, type Question } from '@/utils/surveyUtils';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/campaigns/$campaignId/$phase/survey')({
  component: RouteComponent,
});

function RouteComponent() {
  const { phase, campaignId } = Route.useParams();
  // Create a query that fetch all surveys of the current phase
  console.log('From survey builder', campaignId, phase);

  // imbis na questions ang ipapass, ung surveys array nlng; Gawin pag may backend na
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

  return (
    <div>
      <Header />
      <SurveyBuilderPage questions={questions} setQuestions={setQuestions} />
    </div>
  );
}
