import React, { useState } from 'react';
import { Question } from '../../types';

interface TextQuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ 
  question, 
  value, 
  onChange,
  required = false
}) => {
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const isValid = newValue.length >= (question.min || 0) && 
                   newValue.length <= (question.max || Infinity);
    
    setIsInvalid(!isValid);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        minLength={question.min}
        maxLength={question.max}
        rows={4}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${isInvalid 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300'}`}
        required={required}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          Min: {question.min} characters
        </span>
        <span className={value && value.length < (question.min || 0) ? 'text-red-500' : ''}>
          {value ? value.length : 0}/{question.max} characters
        </span>
      </div>
    </div>
  );
};

export default TextQuestion;