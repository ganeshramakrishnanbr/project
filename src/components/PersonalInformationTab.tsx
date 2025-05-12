import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import QuestionRenderer from './questions/QuestionRenderer';

interface PersonalInformationTabProps {
  stateCode: string;
}

const PersonalInformationTab: React.FC<PersonalInformationTabProps> = ({ stateCode }) => {
  const { templates, answers } = useQuestions();
  const stateTemplate = templates.find(template => template.state === stateCode);

  if (!stateTemplate) {
    return <div>No template found for state {stateCode}</div>;
  }

  return (
    <div className="space-y-8">
      {stateTemplate.questions.map(question => (
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

export default PersonalInformationTab;