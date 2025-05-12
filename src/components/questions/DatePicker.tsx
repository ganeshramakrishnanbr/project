import React from 'react';
import { Question } from '../../types';

interface DatePickerProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  question,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      />
    </div>
  );
};

export default DatePicker;