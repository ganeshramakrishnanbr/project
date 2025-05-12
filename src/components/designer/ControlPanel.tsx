import React from 'react';
import { QuestionType } from '../../types';
import { Type, Dumbbell as Numbers, ToggleLeft, List, CheckSquare, ChevronDown, Calendar, Clock, Pill, Grid } from 'lucide-react';

interface ControlPanelProps {
  onAddQuestion: (type: QuestionType, withConfig?: boolean) => void;
}

const controls = [
  { type: 'text' as QuestionType, label: 'Text Input', icon: Type },
  { type: 'numeric' as QuestionType, label: 'Numeric Input', icon: Numbers },
  { type: 'boolean' as QuestionType, label: 'Yes/No', icon: ToggleLeft },
  { type: 'radio' as QuestionType, label: 'Radio Group', icon: List },
  { type: 'checkbox' as QuestionType, label: 'Checkboxes', icon: CheckSquare },
  { type: 'dropdown' as QuestionType, label: 'Dropdown', icon: ChevronDown },
  { type: 'date' as QuestionType, label: 'Date Picker', icon: Calendar },
  { type: 'time' as QuestionType, label: 'Time Picker', icon: Clock },
  { type: 'medication' as QuestionType, label: 'Medication', icon: Pill },
  { type: 'matrix' as QuestionType, label: 'Matrix Table', icon: Grid }
];

const ControlPanel: React.FC<ControlPanelProps> = ({ onAddQuestion }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Question Types</h2>
      <div className="space-y-2">
        {controls.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onAddQuestion(type)}
            className="w-full flex items-center p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Icon className="h-5 w-5 mr-3 text-gray-400" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;