import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuestionTemplate, AnswerState, Question } from '../types';
import { questionsData } from '../data/questionsData';

interface QuestionsContextType {
  templates: QuestionTemplate[];
  updateTemplate: (stateCode: string, updatedTemplate: QuestionTemplate) => void;
  answers: AnswerState;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerState>>;
  updateAnswer: (questionId: string, answer: any, unit?: string) => void;
  questions: Question[];
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<QuestionTemplate[]>(questionsData);
  const [answers, setAnswers] = useState<AnswerState>({});

  // Flatten all questions from all templates
  const questions = templates.flatMap(template => template.questions);

  const updateTemplate = (stateCode: string, updatedTemplate: QuestionTemplate) => {
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.state === stateCode ? updatedTemplate : template
      )
    );
  };

  const updateAnswer = (questionId: string, value: any, unit?: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, unit }
    }));
  };

  return (
    <QuestionsContext.Provider value={{ 
      templates, 
      updateTemplate, 
      answers, 
      setAnswers, 
      updateAnswer,
      questions 
    }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};