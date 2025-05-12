import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import QuestionRenderer from './questions/QuestionRenderer';

interface SleepAssessmentTabProps {
  stateCode: string;
}

const SleepAssessmentTab: React.FC<SleepAssessmentTabProps> = ({ stateCode }) => {
  const { templates, answers } = useQuestions();
  const stateTemplate = templates.find(template => template.state === stateCode);

  if (!stateTemplate?.sleepQuestions) {
    return <div>Sleep assessment not available for {stateCode}</div>;
  }

  return (
    <div className="space-y-8">
      {stateTemplate.sleepQuestions.map(question => (
        <QuestionRenderer 
          key={question.id} 
          question={question} 
          answers={answers}
          required={true}
        />
      ))}
    </div>
  );
};

export default SleepAssessmentTab;