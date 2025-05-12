import React from 'react';
import { useQuestions } from '../context/QuestionsContext';

interface AvocationTableProps {
  stateCode: string;
  required?: boolean;
}

const AvocationTable: React.FC<AvocationTableProps> = ({ stateCode, required = false }) => {
  const { templates, answers, updateAnswer } = useQuestions();
  const stateTemplate = templates.find(template => template.state === stateCode);

  const activities = [
    { id: 'MotorRacing', label: 'Motor Racing' },
    { id: 'UnderwaterActivities', label: 'Underwater Activities' },
    { id: 'Skydiving', label: 'Skydiving/Parachuting' },
    { id: 'HelicopterSkiing', label: 'Helicopter Skiing' },
    { id: 'Gambling', label: 'Gambling' },
    { id: 'Hunting', label: 'Hunting' },
    { id: 'Cycling', label: 'Cycling' },
    { id: 'Mountaineering', label: 'Mountain Climbing/Mountaineering' },
    { id: 'RockClimbing', label: 'Rock Climbing' },
    { id: 'BungeeJumping', label: 'Bungee Jumping' },
    { id: 'CombatSports', label: 'Combat Sports' },
    { id: 'ExtremeSports', label: 'Extreme Sports' },
    { id: 'Aviation', label: 'Aviation/Piloting' },
    { id: 'OffRoadDriving', label: 'Off-road Driving' },
    { id: 'Rafting', label: 'White Water Rafting/Kayaking' },
    { id: 'Paragliding', label: 'Paragliding/Hang Gliding' },
    { id: 'NoneOfAbove', label: 'None of the above' }
  ];

  const timeframes = [
    { id: '3Months', label: 'Last 3 months' },
    { id: '6Months', label: 'Last 6 months' },
    { id: '9Months', label: 'Last 9 months' },
    { id: '12Months', label: 'Last 12 months' }
  ];

  const handleCheckboxChange = (activityId: string, timeframe: string | null = null) => {
    const questionId = timeframe ? `${activityId}${timeframe}` : activityId;
    const currentValue = answers[questionId]?.value;
    updateAnswer(questionId, !currentValue);

    // If unchecking the main activity, uncheck all timeframes
    if (!timeframe && currentValue) {
      timeframes.forEach(tf => {
        updateAnswer(`${activityId}${tf.id}`, false);
      });
    }

    // If checking "None of the above", uncheck all other activities
    if (activityId === 'NoneOfAbove' && !currentValue) {
      activities.forEach(activity => {
        if (activity.id !== 'NoneOfAbove') {
          updateAnswer(activity.id, false);
          timeframes.forEach(tf => {
            updateAnswer(`${activity.id}${tf.id}`, false);
          });
        }
      });
    }

    // If checking any activity, uncheck "None of the above"
    if (activityId !== 'NoneOfAbove' && !currentValue) {
      updateAnswer('NoneOfAbove', false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Please select activities
              {required && <span className="text-red-500 ml-1">*</span>}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              I do this activity
            </th>
            {timeframes.map(timeframe => (
              <th key={timeframe.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                {timeframe.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id} className={activity.id === 'NoneOfAbove' ? 'bg-gray-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {activity.label}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={answers[activity.id]?.value || false}
                  onChange={() => handleCheckboxChange(activity.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required={required}
                />
              </td>
              {activity.id !== 'NoneOfAbove' && timeframes.map(timeframe => (
                <td key={timeframe.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={answers[`${activity.id}${timeframe.id}`]?.value || false}
                    onChange={() => handleCheckboxChange(activity.id, timeframe.id)}
                    disabled={!answers[activity.id]?.value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </td>
              ))}
              {activity.id === 'NoneOfAbove' && (
                <td colSpan={4} className="px-6 py-4" />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvocationTable;