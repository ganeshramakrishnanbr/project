import React from 'react';
import { Question } from '../../types';

interface CheckboxQuestionProps {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  required?: boolean;
}

const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({ 
  question, 
  value = [], 
  onChange,
  required = false
}) => {
  const handleChange = (option: string) => {
    const newValue = value?.includes(option)
      ? value.filter(v => v !== option)
      : [...(value || []), option];
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <p className="block text-gray-700 text-sm font-medium mb-3">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex flex-wrap gap-4">
        {question.options?.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={value?.includes(option)}
              onChange={() => handleChange(option)}
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              required={required && value?.length === 0}
            />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxQuestion;