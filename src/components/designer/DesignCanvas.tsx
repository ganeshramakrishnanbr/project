import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../types';
import { GripVertical, Trash, Asterisk } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DesignCanvasProps {
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

const SortableQuestion: React.FC<{
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (question: Question) => void;
}> = ({ question, isSelected, onSelect, onDelete, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleRequired = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...question,
      required: !question.required
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 mb-4 cursor-move ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-gray-400 mr-3" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{question.text}</h3>
            <p className="text-sm text-gray-500">{question.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleRequired}
            className={`p-1 ${question.required ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            title={question.required ? 'Make optional' : 'Make required'}
          >
            <Asterisk className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Delete question"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DesignCanvas: React.FC<DesignCanvasProps> = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 min-h-[600px]">
      {questions.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Drag and drop questions here
        </div>
      ) : (
        <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
          {questions.map((question) => (
            <SortableQuestion
              key={question.id}
              question={question}
              isSelected={selectedQuestion?.id === question.id}
              onSelect={() => onSelectQuestion(question)}
              onDelete={() => onDeleteQuestion(question.id)}
              onUpdate={onUpdateQuestion}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
};

export default DesignCanvas;