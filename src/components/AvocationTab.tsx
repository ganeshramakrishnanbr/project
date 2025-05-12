import React from 'react';
import { useQuestions } from '../context/QuestionsContext';
import AvocationTable from './AvocationTable';
import QuestionRenderer from './questions/QuestionRenderer';

interface AvocationTabProps {
  stateCode: string;
}

const AvocationTab: React.FC<AvocationTabProps> = ({ stateCode }) => {
  const { templates, answers } = useQuestions();
  const stateTemplate = templates.find(template => template.state === stateCode);

  if (!stateTemplate?.avocationQuestions) {
    return <div>No avocation questions found for state {stateCode}</div>;
  }

  // Check if any activity is selected (including "None of the above")
  const hasSelectedActivity = answers['NoneOfAbove']?.value === true || 
    Object.entries(answers).some(([key, answer]) => 
      !key.includes('Months') && 
      key !== 'NoneOfAbove' && 
      answer?.value === true
    );

  // Function to check if an activity's questions should be shown
  const shouldShowActivityQuestions = (activityId: string) => {
    return answers[activityId]?.value === true;
  };

  // Function to render questions for a specific activity
  const renderActivityQuestions = (activityId: string) => {
    if (!shouldShowActivityQuestions(activityId)) return null;

    const activityQuestions = stateTemplate.avocationQuestions.filter(question => 
      question.sectionName === activityId.replace(/([A-Z])/g, ' $1').trim() &&
      question.type !== 'checkbox'
    );

    if (activityQuestions.length === 0) return null;

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {activityId.replace(/([A-Z])/g, ' $1').trim()} Details
        </h2>
        {activityQuestions.map(question => (
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

  const activities = [
    'MotorRacing',
    'UnderwaterActivities',
    'Skydiving',
    'HelicopterSkiing',
    'Gambling',
    'Hunting',
    'Cycling',
    'Mountaineering',
    'RockClimbing',
    'BungeeJumping',
    'CombatSports',
    'ExtremeSports',
    'Aviation',
    'OffRoadDriving',
    'Rafting',
    'Paragliding'
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <AvocationTable stateCode={stateCode} required={!hasSelectedActivity} />
        {!hasSelectedActivity && (
          <p className="text-sm text-red-600">
            Please select at least one activity or "None of the above"
          </p>
        )}
      </div>
      
      {activities.map(activityId => renderActivityQuestions(activityId))}
    </div>
  );
};

export default AvocationTab;