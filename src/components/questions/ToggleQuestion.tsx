import React from 'react';
import { Question } from '../../types';
import { Switch } from '@headlessui/react';

interface ToggleQuestionProps {
  question: Question;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  required?: boolean;
}

const ToggleQuestion: React.FC<ToggleQuestionProps> = ({
  question,
  value = false,
  onChange,
  required
}) => {
  return (
    <div className="relative flex items-center">
      <Switch
        checked={value}
        onChange={onChange}
        className={`${
          value ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            value ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className="ml-3 text-sm">{question.text}</span>
      {required && <span className="text-red-500 ml-1">*</span>}
    </div>
  );
};

export default ToggleQuestion;