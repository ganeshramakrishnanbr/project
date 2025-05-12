import React from 'react';
import { Question } from '../../types';

interface DropdownQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
}

const DropdownQuestion: React.FC<DropdownQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  required = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      >
        <option value="">Select an option</option>
        {question.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownQuestion;