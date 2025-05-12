import React from 'react';
import { AnswerState, Medication } from '../types';
import { ArrowLeft } from 'lucide-react';

interface SummaryProps {
  answers: AnswerState;
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({ answers, onBack }) => {
  const formatValue = (key: string, answer: any) => {
    if (key.includes('Medication') && Array.isArray(answer.value)) {
      return (
        <div>
          <p className="font-medium">Medications:</p>
          {(answer.value as Medication[]).length === 0 ? (
            <p className="text-gray-500 italic">No medications added</p>
          ) : (
            <ul className="list-disc ml-5">
              {(answer.value as Medication[]).map((med) => (
                <li key={med.id}>{med.name}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    
    if (typeof answer.value === 'boolean') {
      return answer.value ? 'Yes' : 'No';
    }
    
    if (answer.unit) {
      return `${answer.value} ${answer.unit}`;
    }
    
    return answer.value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Questionnaire
        </button>
        <h2 className="text-xl font-bold text-gray-800 mt-4">Submitted Answers Summary</h2>
        <p className="text-gray-600">Review your responses</p>
      </div>
      
      <div className="border border-gray-200 rounded-md p-4">
        <pre className="whitespace-pre-wrap overflow-x-auto text-sm">
          {JSON.stringify(answers, null, 2)}
        </pre>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Formatted Responses</h3>
        <div className="space-y-4">
          {Object.entries(answers).map(([key, answer]) => (
            <div key={key} className="border-b border-gray-200 pb-3">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700">{key}</span>
                <div className="mt-1">{formatValue(key, answer)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;