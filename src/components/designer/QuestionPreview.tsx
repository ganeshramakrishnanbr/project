import React, { useState } from 'react';
import { Question } from '../../types';
import QuestionRenderer from '../questions/QuestionRenderer';

interface QuestionPreviewProps {
  questions: Question[];
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.condition) return true;
    
    const { questionId, value } = question.condition;
    const answer = answers[questionId];
    
    if (!answer?.value) return false;

    // Special handling for matrix type dependencies
    const dependentQuestion = questions.find(q => q.id === questionId);
    if (dependentQuestion?.type === 'matrix') {
      const matrixValue = value as Record<string, Record<string, boolean>>;
      const matrixAnswer = answer.value as Record<string, Record<string, boolean>>;
      
      // Check if any of the selected combinations match
      return Object.entries(matrixValue).some(([rowId, columns]) => {
        if (!matrixAnswer[rowId]) return false;
        return Object.entries(columns).some(([columnId, isSelected]) => {
          return isSelected && !!matrixAnswer[rowId]?.[columnId];
        });
      });
    }
    
    // Handle array values (e.g., for checkbox questions)
    if (Array.isArray(value)) {
      if (Array.isArray(answer.value)) {
        return value.some(v => answer.value.includes(v));
      }
      return value.includes(answer.value);
    }
    
    if (Array.isArray(answer.value)) {
      return answer.value.includes(value);
    }
    
    return answer.value === value;
  };

  const handleAnswerChange = (questionId: string, value: any, unit?: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, unit }
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Preview</h2>
      <div className="space-y-8">
        {questions.map(question => (
          shouldShowQuestion(question) && (
            <div key={question.id}>
              <QuestionRenderer
                question={question}
                answers={answers}
                onChange={handleAnswerChange}
                required={question.required}
                mode="preview"
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default QuestionPreview;