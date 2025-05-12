import React from 'react';
import { Question } from '../../types';

interface BooleanQuestionProps {
  question: Question;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  required?: boolean;
}

const BooleanQuestion: React.FC<BooleanQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  required = false
}) => {
  const handleChange = (selectedValue: boolean) => {
    onChange(selectedValue);
  };

  return (
    <div className="mb-4">
      <p className="block text-gray-700 text-sm font-medium mb-3">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={question.id}
            checked={value === true}
            onChange={() => handleChange(true)}
            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            required={required && value === undefined}
          />
          <span className="ml-2 text-gray-700">Yes</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={question.id}
            checked={value === false}
            onChange={() => handleChange(false)}
            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            required={required && value === undefined}
          />
          <span className="ml-2 text-gray-700">No</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={question.id}
            checked={value === undefined}
            onChange={() => handleChange(undefined as unknown as boolean)}
            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            required={required && value === undefined}
          />
          <span className="ml-2 text-gray-700">Not Sure</span>
        </label>
      </div>
    </div>
  );
};

export default BooleanQuestion;