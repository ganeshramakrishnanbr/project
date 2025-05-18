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
import MultiselectQuestion from './MultiselectQuestion';
import ToggleQuestion from './ToggleQuestion';
import SliderQuestion from './SliderQuestion';

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
  const { updateAnswer, questions: allQuestionsFromContext } = useQuestions(); 

  const handleAnswerChange = (value: any, unit?: string) => {
    if (onChange) {
      onChange(question.id, value, unit);
    } else {
      updateAnswer(question.id, value, unit);
    }
  };

  if (question.type === 'columns' && question.columnLayout) {
    const { distribution, children: columnChildren = {} } = question.columnLayout;
    const columnWidths = distribution.split('-').map(Number);

    return (
      <div className="flex -mx-2 mb-6">
        {columnWidths.map((widthPercentage, colIndex) => {
          const columnQuestionIds = columnChildren[colIndex] || [];
          const questionsInColumn = columnQuestionIds
            .map(id => allQuestionsFromContext.find(q => q.id === id))
            .filter((q): q is Question => q !== undefined);
          
          let widthClass = 'w-full';
          if (widthPercentage === 25) widthClass = 'w-1/4';
          else if (widthPercentage === 33) widthClass = 'w-1/3';
          else if (widthPercentage === 50) widthClass = 'w-1/2';
          else if (widthPercentage === 66) widthClass = 'w-2/3';
          else if (widthPercentage === 75) widthClass = 'w-3/4';
          
          return (
            <div key={colIndex} className={`px-2 ${widthClass}`}>
              {questionsInColumn.map(qInCol => (
                <QuestionRenderer
                  key={qInCol.id}
                  question={qInCol}
                  answers={answers}
                  required={qInCol.required}
                  onChange={onChange}
                  mode={mode}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  if (question.condition) {
    const { questionId, value } = question.condition;
    const answer = answers[questionId];
    if (!answer?.value) return null;

    const dependentQuestion = allQuestionsFromContext.find(q => q.id === questionId);
    if (dependentQuestion?.type === 'matrix') {
      const matrixValue = value as unknown as Record<string, Record<string, boolean>>;
      const matrixAnswer = answer.value as Record<string, Record<string, boolean>>;
      
      const matches = Object.entries(matrixValue).some(([rowId, columns]) => {
        if (!matrixAnswer[rowId]) return false;
        return Object.entries(columns).some(([columnId, isSelected]) => {
          return isSelected && !!matrixAnswer[rowId]?.[columnId];
        });
      });
      
      if (!matches) return null;
    } else if (Array.isArray(value)) {
      if (Array.isArray(answer.value)) {
        const answerArray = answer.value as any[];
        if (!value.some(v => answerArray.includes(v))) return null;
      } else {
        if (!value.includes(answer.value as string)) return null;
      }
    } else if (Array.isArray(answer.value)) {
      const answerArray = answer.value as any[];
      if (!answerArray.includes(value)) return null;
    } else {
      const answerStr = valueToString(answer.value);
      const valueStr = valueToString(value);
      if (dependentQuestion?.type !== 'columns' && answerStr !== valueStr) return null;
      if (answerStr !== valueStr && question.type !== 'columns') return null;
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
      case 'multiselect':
        return (
          <MultiselectQuestion
            question={question}
            value={isArrayOfStrings(answer?.value) ? answer.value : []}
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'toggle':
        return (
          <ToggleQuestion 
            question={question} 
            value={answers[question.id]?.value as boolean} 
            onChange={(value) => handleAnswerChange(value)}
            required={required}
          />
        );
      case 'slider':
        return (
          <SliderQuestion
            question={question}
            value={answer?.value as number}
            onChange={(val: number) => handleAnswerChange(val)}
            required={required}
            mode={mode}
          />
        );
      case 'columns':
        return null;
      default:
        return <div>Unknown question type: {question.type}</div>;
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4" key={question.id}>
        {renderQuestionByType()}
      </div>
      
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-blue-200 mt-4">
          {question.subQuestions.map(subQuestion => (
            <QuestionRenderer 
              key={subQuestion.id}
              question={subQuestion}
              answers={answers}
              required={subQuestion.required ?? false}
              onChange={onChange}
              mode={mode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;