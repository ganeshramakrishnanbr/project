import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../context/QuestionsContext';
import { Tab } from '@headlessui/react';
import { ArrowLeft, Save, CheckCircle, XCircle } from 'lucide-react';
import Summary from './Summary';
import PersonalInformationTab from './PersonalInformationTab';
import SleepAssessmentTab from './SleepAssessmentTab';
import AvocationTab from './AvocationTab';
import DiabetesTab from './DiabetesTab';
import { Question } from '../types';

const Questionnaire: React.FC = () => {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const { templates, answers, setAnswers } = useQuestions();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabValidation, setTabValidation] = useState({
    personalInfo: { isValid: false, isDirty: false },
    sleepAssessment: { isValid: false, isDirty: false },
    avocation: { isValid: false, isDirty: false },
    diabetes: { isValid: false, isDirty: false }
  });

  const stateTemplate = templates.find(template => template.state === state);
  const hasSleepAssessment = stateTemplate?.sleepQuestions !== undefined;
  const hasAvocation = stateTemplate?.avocationQuestions !== undefined;

  // Helper function to check if a question should be validated based on its conditions
  const shouldValidateQuestion = (question: Question): boolean => {
    if (!question.condition) return true;
    
    const conditionAnswer = answers[question.condition.questionId];
    if (!conditionAnswer) return false;

    // Handle matrix dependencies
    const dependentQuestion = stateTemplate?.questions.find(q => q.id === question.condition.questionId);
    if (dependentQuestion?.type === 'matrix') {
      const matrixValue = question.condition.value as Record<string, Record<string, boolean>>;
      const matrixAnswer = conditionAnswer.value as Record<string, Record<string, boolean>>;
      
      return Object.entries(matrixValue).some(([rowId, columns]) => {
        if (!matrixAnswer[rowId]) return false;
        return Object.entries(columns).some(([columnId, isSelected]) => {
          return isSelected && !!matrixAnswer[rowId]?.[columnId];
        });
      });
    }

    // Handle array values (e.g., for checkbox questions)
    if (Array.isArray(question.condition.value)) {
      if (Array.isArray(conditionAnswer.value)) {
        return question.condition.value.some(v => conditionAnswer.value.includes(v));
      }
      return question.condition.value.includes(conditionAnswer.value);
    }
    
    // Handle case where the answer is an array but the condition value isn't
    if (Array.isArray(conditionAnswer.value)) {
      return conditionAnswer.value.includes(question.condition.value);
    }
    
    return conditionAnswer.value === question.condition.value;
  };

  // Helper function to validate a single question
  const isQuestionValid = (question: Question): boolean => {
    if (!shouldValidateQuestion(question)) return true;

    const answer = answers[question.id];
    if (!answer || answer.value === undefined || answer.value === '') return false;

    // Special handling for matrix type questions
    if (question.type === 'matrix') {
      const matrixValue = answer.value as Record<string, Record<string, boolean>>;
      if (!matrixValue || Object.keys(matrixValue).length === 0) return false;
      
      // If none of the above is selected, that's valid
      if (matrixValue['noneRow']) return true;
      
      // Otherwise check if at least one option is selected
      return Object.values(matrixValue).some(row => 
        Object.values(row).some(isSelected => isSelected)
      );
    }

    // Special handling for medication type questions
    if (question.type === 'medication' && Array.isArray(answer.value)) {
      return answer.value.length > 0;
    }

    // Special handling for checkbox type questions
    if (question.type === 'checkbox' && Array.isArray(answer.value)) {
      return answer.value.length > 0;
    }

    // Special handling for numeric type questions
    if (question.type === 'numeric') {
      const numValue = Number(answer.value);
      return !isNaN(numValue) && 
             numValue >= (question.min || -Infinity) && 
             numValue <= (question.max || Infinity);
    }

    // Special handling for text type questions
    if (question.type === 'text') {
      const strValue = String(answer.value);
      return strValue.length >= (question.min || 0) && 
             strValue.length <= (question.max || Infinity);
    }

    // Recursively validate subquestions if they exist and should be shown
    if (question.subQuestions) {
      return question.subQuestions.every(sq => {
        if (!shouldValidateQuestion(sq)) return true;
        return isQuestionValid(sq);
      });
    }

    return true;
  };

  // Validate personal information tab
  useEffect(() => {
    if (!stateTemplate) return;

    const validatePersonalInfo = () => {
      const allQuestionsValid = stateTemplate.questions.every(q => isQuestionValid(q));
      const isDirty = stateTemplate.questions.some(q => {
        const answer = answers[q.id];
        return answer !== undefined;
      });

      setTabValidation(prev => ({
        ...prev,
        personalInfo: {
          isValid: allQuestionsValid,
          isDirty
        }
      }));
    };

    validatePersonalInfo();
  }, [answers, stateTemplate]);

  // Validate sleep assessment tab
  useEffect(() => {
    if (!stateTemplate?.sleepQuestions) return;

    const validateSleepAssessment = () => {
      const allQuestionsValid = stateTemplate.sleepQuestions.every(q => isQuestionValid(q));
      const isDirty = stateTemplate.sleepQuestions.some(q => {
        const answer = answers[q.id];
        return answer !== undefined;
      });

      setTabValidation(prev => ({
        ...prev,
        sleepAssessment: {
          isValid: allQuestionsValid,
          isDirty
        }
      }));
    };

    validateSleepAssessment();
  }, [answers, stateTemplate]);

  // Validate avocation tab
  useEffect(() => {
    if (!stateTemplate?.avocationQuestions) return;

    const validateAvocation = () => {
      // Check if either an activity is selected or "None of the above" is selected
      const hasSelectedActivity = answers['NoneOfAbove']?.value === true || 
        Object.entries(answers).some(([key, answer]) => 
          !key.includes('Months') && 
          key !== 'NoneOfAbove' && 
          answer?.value === true
        );

      // If no activity is selected, the tab is invalid
      if (!hasSelectedActivity) {
        setTabValidation(prev => ({
          ...prev,
          avocation: {
            isValid: false,
            isDirty: Object.keys(answers).some(key => key === 'NoneOfAbove' || !key.includes('Months'))
          }
        }));
        return;
      }

      // If "None of the above" is selected, the tab is valid
      if (answers['NoneOfAbove']?.value === true) {
        setTabValidation(prev => ({
          ...prev,
          avocation: {
            isValid: true,
            isDirty: true
          }
        }));
        return;
      }

      // For selected activities, validate their questions
      const selectedActivities = Object.entries(answers)
        .filter(([key, answer]) => 
          !key.includes('Months') && 
          key !== 'NoneOfAbove' && 
          answer?.value === true
        )
        .map(([key]) => key);

      const allQuestionsValid = stateTemplate.avocationQuestions
        .filter(q => selectedActivities.some(activity => q.sectionName.includes(activity)))
        .every(q => isQuestionValid(q));

      setTabValidation(prev => ({
        ...prev,
        avocation: {
          isValid: allQuestionsValid,
          isDirty: true
        }
      }));
    };

    validateAvocation();
  }, [answers, stateTemplate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    setShowSummary(true);
  };

  if (!stateTemplate) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600">State not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getTabStatus = (tabName: 'personalInfo' | 'sleepAssessment' | 'avocation' | 'diabetes') => {
    const tabStatus = tabValidation[tabName];
    if (!tabStatus) return null;
    
    const { isValid, isDirty } = tabStatus;
    if (!isDirty) return null;
    
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">{state} Medical Questionnaire</h1>
      </div>

      {showSummary ? (
        <Summary answers={answers} onBack={() => setShowSummary(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
          <Tab.Group vertical selectedIndex={selectedTab} onChange={setSelectedTab}>
            <div className="flex">
              <Tab.List className="w-64 bg-gray-50 p-4 border-r border-gray-200 rounded-l-lg">
                <Tab
                  className={({ selected }) =>
                    `w-full py-3 px-4 text-left text-sm font-medium rounded-lg mb-2 focus:outline-none flex items-center justify-between
                    ${selected
                      ? 'bg-blue-600 text-white'
                      : tabValidation.personalInfo.isDirty
                        ? tabValidation.personalInfo.isValid
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span>Personal Information - Weight</span>
                  {getTabStatus('personalInfo')}
                </Tab>
                {hasSleepAssessment && (
                  <Tab
                    className={({ selected }) =>
                      `w-full py-3 px-4 text-left text-sm font-medium rounded-lg mb-2 focus:outline-none flex items-center justify-between
                      ${selected
                        ? 'bg-blue-600 text-white'
                        : tabValidation.sleepAssessment.isDirty
                          ? tabValidation.sleepAssessment.isValid
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span>Sleep Assessment</span>
                    {getTabStatus('sleepAssessment')}
                  </Tab>
                )}
                {hasAvocation && (
                  <Tab
                    className={({ selected }) =>
                      `w-full py-3 px-4 text-left text-sm font-medium rounded-lg mb-2 focus:outline-none flex items-center justify-between
                      ${selected
                        ? 'bg-blue-600 text-white'
                        : tabValidation.avocation.isDirty
                          ? tabValidation.avocation.isValid
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span>Avocation</span>
                    {getTabStatus('avocation')}
                  </Tab>
                )}
                {stateTemplate.diabetesQuestions && (
                  <Tab
                    className={({ selected }) =>
                      `w-full py-3 px-4 text-left text-sm font-medium rounded-lg mb-2 focus:outline-none flex items-center justify-between
                      ${selected
                        ? 'bg-blue-600 text-white'
                        : tabValidation.diabetes.isDirty
                          ? tabValidation.diabetes.isValid
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span>Diabetes Information</span>
                    {getTabStatus('diabetes')}
                  </Tab>
                )}
              </Tab.List>

              <Tab.Panels className="flex-1 p-6">
                <Tab.Panel>
                  <PersonalInformationTab stateCode={state} />
                </Tab.Panel>
                {hasSleepAssessment && (
                  <Tab.Panel>
                    <SleepAssessmentTab stateCode={state} />
                  </Tab.Panel>
                )}
                {hasAvocation && (
                  <Tab.Panel>
                    <AvocationTab stateCode={state} />
                  </Tab.Panel>
                )}
                {stateTemplate.diabetesQuestions && (
                  <Tab.Panel>
                    <DiabetesTab stateCode={state} />
                  </Tab.Panel>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Submit Questionnaire
                  </button>
                </div>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </form>
      )}
    </div>
  );
};

export default Questionnaire;