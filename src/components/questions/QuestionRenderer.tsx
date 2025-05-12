import React from 'react';
import { Question, AnswerState, Medication, AnswerValue } from '../../types';
import { useQuestions } from '../../context/QuestionsContext';
import NumericQuestion from './NumericQuestion';
import BooleanQuestion from './BooleanQuestion';
import TextQuestion from './TextQuestion';
import MedicationQuestion from './MedicationQuestion';
import RadioQuestion from './RadioQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TimeQuestion from './TimeQuestion';
import DatePicker from './DatePicker';
import DropdownQuestion from './DropdownQuestion';
import MatrixQuestion from './MatrixQuestion';

const isArrayOfStrings = (value: any): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

const isMatrixAnswer = (value: any): value is { [rowId: string]: { [columnId: string]: boolean } } => {
  return typeof value === 'object' && value !== null && 
    Object.values(value).every(row => 
      typeof row === 'object' && row !== null &&
      Object.values(row).every(v => typeof v === 'boolean')
    );
};

const valueToString = (value: AnswerValue): string => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  if (isArrayOfStrings(value)) {
    return value.join(',');
  }
  if (Array.isArray(value)) {
    return value.map(v => v.toString()).join(',');
  }
  return '';
};

interface QuestionRendererProps {
  question: Question;
  answers: AnswerState;
  required?: boolean;
  onChange?: (questionId: string, value: any, unit?: string) => void;
  mode?: 'design' | 'preview';
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question, 
  answers, 
  required = false,
  onChange,
  mode = 'preview'
}) => {
  const { updateAnswer, questions } = useQuestions();

  const handleAnswerChange = (value: any, unit?: string) => {
    if (onChange) {
      onChange(question.id, value, unit);
    } else {
      updateAnswer(question.id, value, unit);
    }
  };

  if (question.condition) {
    const { questionId, value } = question.condition;
    const answer = answers[questionId];
    if (!answer?.value) return null;

    // Special handling for matrix type dependencies
    const dependentQuestion = questions.find((q: Question) => q.id === questionId);
    if (dependentQuestion?.type === 'matrix') {
      // Type assertion for matrix value
      const matrixValue = value as Record<string, Record<string, boolean>>;
      const matrixAnswer = answer.value as Record<string, Record<string, boolean>>;
      
      // Check if any of the selected combinations match
      const matches = Object.entries(matrixValue).some(([rowId, columns]) => {
        if (!matrixAnswer[rowId]) return false;
        return Object.entries(columns).some(([columnId, isSelected]) => {
          return isSelected && !!matrixAnswer[rowId]?.[columnId];
        });
      });
      
      if (!matches) return null;
    } else if (Array.isArray(value)) {
      // Handle array values (e.g., for checkbox questions)
      if (Array.isArray(answer.value)) {
        if (!value.some(v => answer.value.includes(v))) return null;
      } else {
        if (!value.includes(answer.value)) return null;
      }
    } else if (Array.isArray(answer.value)) {
      // Handle case where the answer is an array but the condition value isn't
      if (!answer.value.includes(value)) return null;
    } else {
      // Handle simple value comparison
      const answerStr = valueToString(answer.value);
      const valueStr = valueToString(value);
      if (answerStr !== valueStr) return null;
    }
  }

  const renderQuestionByType = () => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'numeric':
        return (
          <NumericQuestion 
            question={question} 
            value={answers[question.id]?.value as number} 
            unit={answers[question.id]?.unit}
            onChange={handleAnswerChange}
            required={required}
          />
        );
      case 'boolean':
        return (
          <BooleanQuestion 
            question={question} 
            value={answers[question.id]?.value as boolean} 
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'text':
        return (
          <TextQuestion 
            question={question} 
            value={answers[question.id]?.value as string} 
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'medication':
        return (
          <MedicationQuestion 
            question={question} 
            medications={answers[question.id]?.value as Medication[] || []} 
            onChange={(medications) => handleAnswerChange(medications)}
            required={required}
          />
        );
      case 'radio':
        return (
          <RadioQuestion
            question={question}
            value={answers[question.id]?.value as string}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'checkbox':
        return (
          <CheckboxQuestion
            question={question}
            value={isArrayOfStrings(answer?.value) ? answer.value : []}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'time':
        return (
          <TimeQuestion
            question={question}
            value={answers[question.id]?.value as string}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'date':
        return (
          <DatePicker
            question={question}
            value={answers[question.id]?.value as string}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'dropdown':
        return (
          <DropdownQuestion
            question={question}
            value={answers[question.id]?.value as string}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'matrix':
        return (
          <MatrixQuestion
            question={question}
            value={isMatrixAnswer(answer?.value) ? answer.value : {}}
            onChange={value => handleAnswerChange(value.value)}
            required={required}
            mode={mode}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        {renderQuestionByType()}
      </div>
      
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-blue-200 mt-4">
          {question.subQuestions.map(subQuestion => (
            <QuestionRenderer 
              key={subQuestion.id}
              question={subQuestion}
              answers={answers}
              required={required}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;