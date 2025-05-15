import React, { useState, useEffect } from 'react'; // Added useEffect for logging
import { Question } from '../../types';
import QuestionRenderer from '../questions/QuestionRenderer';
import { useQuestions } from '../../context/QuestionsContext';

interface QuestionPreviewProps {
  questions: Question[]; // This prop should be templates[0].questions from QuestionDesigner
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ questions: questionsFromDesign }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { questions: allQuestionsFromContext } = useQuestions();

  useEffect(() => {
    console.log('[QuestionPreview] Received questionsFromDesign:', JSON.parse(JSON.stringify(questionsFromDesign)));
    questionsFromDesign.forEach(q => {
      console.log(`[QuestionPreview] Question ID: ${q.id}, Type: ${q.type}, ParentID: ${q.parentId}`);
    });
  }, [questionsFromDesign]);

  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.condition) return true;
    
    const { questionId, value } = question.condition;
    const answer = answers[questionId];
    
    if (!answer?.value) return false;

    const dependentQuestion = allQuestionsFromContext.find(q => q.id === questionId);
    if (dependentQuestion?.type === 'matrix') {
      const matrixValue = value as unknown as Record<string, Record<string, boolean>>; // Corrected cast
      const matrixAnswer = answer.value as Record<string, Record<string, boolean>>;
      
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

  const topLevelQuestions = questionsFromDesign.filter(q => !q.parentId);
  console.log('[QuestionPreview] Filtered topLevelQuestions:', JSON.parse(JSON.stringify(topLevelQuestions.map(q => ({id: q.id, type: q.type, parentId: q.parentId})))));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Preview</h2>
      <div className="space-y-8">
        {topLevelQuestions.map(question => (
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