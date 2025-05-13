import React, { useState } from 'react';
import { Question } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MultiselectQuestionProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
}

const MultiselectQuestion: React.FC<MultiselectQuestionProps> = ({
  question,
  value = [],
  onChange,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string, e?: React.MouseEvent) => {
    // Stop propagation to prevent the dropdown from closing when clicking the checkbox
    e?.stopPropagation();
    
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.multiselect-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative multiselect-container">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} rounded-md py-2 px-3 text-left shadow-sm focus:outline-none`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex justify-between items-center">
            <span className="block truncate text-gray-700">
              {value.length === 0 
                ? "Select options..." 
                : `${value.length} option${value.length === 1 ? '' : 's'} selected`
              }
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {question.options?.map((option) => (
              <div
                key={option}
                className="relative select-none py-2 pl-3 pr-9 cursor-pointer hover:bg-blue-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={(e) => handleOptionClick(option, e.nativeEvent as unknown as React.MouseEvent)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span 
                    className="ml-3 block truncate text-gray-900"
                    onClick={(e) => handleOptionClick(option, e)}
                  >
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map(selected => (
            <span
              key={selected}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {selected}
              <button
                type="button"
                onClick={() => handleOptionClick(selected)}
                className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiselectQuestion;