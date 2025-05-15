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
  const [templates, setTemplates] = useState<QuestionTemplate[]>(() => {
    try {
      console.log('[QuestionsContext] Initializing templates with data:', JSON.parse(JSON.stringify(questionsData)));
      return questionsData;
    } catch (error) {
      console.error('[QuestionsContext] Error initializing templates:', error);
      return [];
    }
  });
  const [answers, setAnswers] = useState<AnswerState>({});

  const getAllQuestions = (currentTemplates: QuestionTemplate[]): Question[] => {
    const allCollectedQuestions: Question[] = [];
    const seenIds = new Set<string>();
    const questionPool = new Map<string, Question>();

    // Step 1: Populate the questionPool with every question from every category in every template.
    currentTemplates.forEach(template => {
      (template.questions || []).forEach(q => { if (q) questionPool.set(q.id, q); });
      (template.sleepQuestions || []).forEach(q => { if (q) questionPool.set(q.id, q); });
      (template.avocationQuestions || []).forEach(q => { if (q) questionPool.set(q.id, q); });
      (template.diabetesQuestions || []).forEach(q => { if (q) questionPool.set(q.id, q); });
    });
    console.log(`[QuestionsContext] Built questionPool with ${questionPool.size} questions. Pool IDs:`, Array.from(questionPool.keys()));

    // Step 2: Define recursive extraction function
    function extractQuestionsRecursive(questionsToProcess: Question[]) {
      for (const question of questionsToProcess) {
        if (question && !seenIds.has(question.id)) {
          allCollectedQuestions.push(question);
          seenIds.add(question.id);

          if (question.type === 'columns' && question.columnLayout && question.columnLayout.children) {
            const childQuestionIds: string[] = Object.values(question.columnLayout.children).flat();
            const childrenToRecurse: Question[] = [];
            for (const childId of childQuestionIds) {
              const childQuestion = questionPool.get(childId);
              if (childQuestion) {
                childrenToRecurse.push(childQuestion);
              } else {
                console.warn(`[QuestionsContext] getAllQuestions: Child question ID ${childId} for column layout ${question.id} not found in questionPool.`);
              }
            }
            if (childrenToRecurse.length > 0) {
              extractQuestionsRecursive(childrenToRecurse);
            }
          }

          if (question.subQuestions && question.subQuestions.length > 0) {
            extractQuestionsRecursive(question.subQuestions);
          }
        }
      }
    }

    // Step 3: Call extractQuestionsRecursive for all top-level question arrays from all templates.
    currentTemplates.forEach(template => {
      extractQuestionsRecursive(template.questions || []);
      extractQuestionsRecursive(template.sleepQuestions || []);
      extractQuestionsRecursive(template.avocationQuestions || []);
      extractQuestionsRecursive(template.diabetesQuestions || []);
    });

    console.log(`[QuestionsContext] Finished getAllQuestions. Total unique questions collected: ${allCollectedQuestions.length}. Collected IDs:`, allCollectedQuestions.map(q => q.id));
    return allCollectedQuestions;
  };

  const questions = getAllQuestions(templates);

  const updateTemplate = (stateCode: string, updatedTemplate: QuestionTemplate) => {
    console.log(`[QuestionsContext] updateTemplate called for state: ${stateCode}. Updated template question IDs:`, (updatedTemplate.questions || []).map(q=>q.id));
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