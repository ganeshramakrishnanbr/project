import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import QuestionRenderer from './questions/QuestionRenderer';

interface DiabetesTabProps {
  stateCode: string;
}

const DiabetesTab: React.FC<DiabetesTabProps> = ({ stateCode }) => {
  const { templates, answers } = useQuestions();
  const stateTemplate = templates.find(template => template.state === stateCode);

  if (!stateTemplate?.diabetesQuestions) {
    return <div>No diabetes questions found for state {stateCode}</div>;
  }

  return (
    <div className="space-y-8">
      {stateTemplate.diabetesQuestions.map(question => (
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

export default DiabetesTab;