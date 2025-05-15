import React from 'react';
import { Question } from '../../types';

interface SliderQuestionProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  mode?: 'design' | 'preview';
}

const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  value,
  onChange,
  required,
  mode = 'preview',
}) => {
  const min = question.min || 0;
  const max = question.max || 100;
  const step = question.step || 1;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`
    };
  };

  return (
    <div className="flex flex-col space-y-4">
      <label className="flex items-center justify-between">
        <span className="font-medium text-gray-700">
          {question.label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <span className="text-gray-600 font-medium">{value}</span>
      </label>      <div className="flex items-center space-x-4">
        {mode === 'design' && <span className="text-sm text-gray-500">{min}</span>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
          style={getBackgroundSize()}
        />
        {mode === 'design' && <span className="text-sm text-gray-500">{max}</span>}
      </div>
      {question.description && (
        <p className="text-sm text-gray-500 mt-1">{question.description}</p>
      )}
    </div>
  );
};

export default SliderQuestion;