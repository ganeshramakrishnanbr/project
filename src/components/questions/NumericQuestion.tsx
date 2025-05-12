import React, { useState } from 'react';
import { Question } from '../../types';

interface NumericQuestionProps {
  question: Question;
  value: number | undefined;
  unit?: string;
  onChange: (value: number, unit: string) => void;
  required?: boolean;
}

const NumericQuestion: React.FC<NumericQuestionProps> = ({ 
  question, 
  value, 
  unit, 
  onChange,
  required = false
}) => {
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    const isValid = newValue === undefined || 
      (newValue >= (question.min || 1) && newValue <= (question.max || 10));
    
    setIsInvalid(!isValid);
    if (isValid) {
      onChange(newValue as number, unit || question.units?.[0] || '');
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(value || 0, e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <div className="flex">
            <input
              type="number"
              value={value === undefined ? '' : value}
              onChange={handleChange}
              min={question.min || 1}
              max={question.max || 10}
              className={`flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isInvalid 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'}`}
              required={required}
            />
            {question.units && (
              <select
                value={unit || question.units[0]}
                onChange={handleUnitChange}
                className={`px-3 py-2 border border-l-0 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isInvalid 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'}`}
              >
                {question.units.map((unitOption) => (
                  <option key={unitOption} value={unitOption}>
                    {unitOption}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Valid range: {question.min || 1} - {question.max || 10}
          </div>
        </div>
      </div>
      {isInvalid && (
        <p className="text-red-500 text-xs mt-1">
          Please enter a value between {question.min || 1} and {question.max || 10}
        </p>
      )}
    </div>
  );
};

export default NumericQuestion;