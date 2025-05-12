import React from 'react';
import { Question } from '../../types';

interface RadioQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  required = false
}) => {
  return (
    <div className="mb-4">
      <p className="block text-gray-700 text-sm font-medium mb-3">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="space-y-2">
        {question.options?.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              required={required && !value}
            />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioQuestion;