import React, { useState } from 'react';
import { QuestionType } from '../../types';
import { 
  Type, 
  Dumbbell as Numbers, 
  ToggleLeft, 
  List, 
  CheckSquare, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Pill,
  Grid,
  Search,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  ToggleRight,
  Minus
} from 'lucide-react';

interface ControlPanelProps {
  onAddQuestion: (type: QuestionType, withConfig?: boolean) => void;
}

const questionControls = [
  { type: 'text' as QuestionType, label: 'Text Input', icon: Type },
  { type: 'numeric' as QuestionType, label: 'Numeric Input', icon: Numbers },
  { type: 'boolean' as QuestionType, label: 'Yes/No', icon: ToggleLeft },
  { type: 'radio' as QuestionType, label: 'Radio Group', icon: List },
  { type: 'checkbox' as QuestionType, label: 'Checkboxes', icon: CheckSquare },
  { type: 'dropdown' as QuestionType, label: 'Dropdown', icon: ChevronDown },
  { type: 'date' as QuestionType, label: 'Date Picker', icon: Calendar },
  { type: 'time' as QuestionType, label: 'Time Picker', icon: Clock },
  { type: 'medication' as QuestionType, label: 'Medication', icon: Pill },
  { type: 'matrix' as QuestionType, label: 'Matrix Table', icon: Grid },
  { type: 'multiselect' as QuestionType, label: 'Multiselect Dropdown', icon: ChevronDown },
  { type: 'toggle' as QuestionType, label: 'Toggle Switch', icon: ToggleRight },
  { type: 'slider' as QuestionType, label: 'Slider', icon: Minus }
];

const ControlPanel: React.FC<ControlPanelProps> = ({ onAddQuestion }) => {
  const [isQuestionTypesOpen, setIsQuestionTypesOpen] = useState(true);
  const [questionTypesSearchTerm, setQuestionTypesSearchTerm] = useState('');

  const filteredQuestionControls = questionControls.filter(control =>
    control.label.toLowerCase().includes(questionTypesSearchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
      <div className="bg-white rounded-lg border border-gray-200 flex-1">
        <button
          onClick={() => setIsQuestionTypesOpen(!isQuestionTypesOpen)}
          className="w-full flex items-center justify-between p-3 text-left font-medium bg-gray-50 hover:bg-gray-100 transition-colors sticky top-0 z-10"
        >
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-900">Question Types</span>
          </div>
          {isQuestionTypesOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        <div className={`transition-all duration-200 ease-in-out ${
          isQuestionTypesOpen ? 'flex-1' : 'h-0'
        } overflow-y-auto`}>
          {isQuestionTypesOpen && (
            <div className="p-3 space-y-2">
              <div className="relative sticky top-0 bg-white z-10 pb-2">
                <input
                  type="text"
                  placeholder="Search question types..."
                  value={questionTypesSearchTerm}
                  onChange={(e) => setQuestionTypesSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 pl-8 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                {filteredQuestionControls.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => onAddQuestion(type)}
                    className="w-full flex items-center p-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors group border border-gray-100 hover:border-blue-200 mb-1"
                  >
                    <Icon className="h-4 w-4 mr-2.5 text-gray-400 group-hover:text-blue-500" />
                    <span className="truncate font-medium">{label}</span>
                  </button>
                ))}
                {filteredQuestionControls.length === 0 && (
                  <p className="text-xs text-gray-500 p-2">No question types match your search</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;