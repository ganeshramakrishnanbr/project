import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Question } from '../../types';
import MatrixQuestion from './MatrixQuestion';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onChange: (question: Question) => void;
}

const MatrixModal: React.FC<MatrixModalProps> = ({
  isOpen,
  onClose,
  question,
  onChange
}) => {
  const [localQuestion, setLocalQuestion] = useState<Question>({
    ...question,
    matrixData: question.matrixData ? {
      ...question.matrixData,
      columns: [...(question.matrixData.columns || [])].map(col => ({...col})),
      rows: [...(question.matrixData.rows || [])].map(row => ({...row}))
    } : undefined
  });

  useEffect(() => {
    setLocalQuestion({
      ...question,
      matrixData: question.matrixData ? {
        ...question.matrixData,
        columns: [...(question.matrixData.columns || [])].map(col => ({...col})),
        rows: [...(question.matrixData.rows || [])].map(row => ({...row}))
      } : undefined
    });
  }, [question]);

  if (!isOpen) return null;

  const handleChange = (updates: Partial<Question>) => {
    const updatedQuestion = {
      ...localQuestion,
      ...updates,
      matrixData: {
        ...localQuestion.matrixData,
        ...(updates.matrixData || {}),
        columns: updates.matrixData?.columns ? 
          [...updates.matrixData.columns].map(col => ({...col})) :
          [...(localQuestion.matrixData?.columns || [])].map(col => ({...col})),
        rows: updates.matrixData?.rows ?
          [...updates.matrixData.rows].map(row => ({...row})) :
          [...(localQuestion.matrixData?.rows || [])].map(row => ({...row}))
      }
    };
    setLocalQuestion(updatedQuestion);
    onChange(updatedQuestion);
  };

  const handleClose = () => {
    // Ensure final state is properly synchronized before closing
    onChange({
      ...localQuestion,
      matrixData: localQuestion.matrixData ? {
        ...localQuestion.matrixData,
        columns: [...(localQuestion.matrixData.columns || [])].map(col => ({...col})),
        rows: [...(localQuestion.matrixData.rows || [])].map(row => ({...row}))
      } : undefined,
      isModalOpen: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Matrix Configuration</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <MatrixQuestion
            question={localQuestion}
            value={{}}
            onChange={handleChange}
            mode="design"
            isModal={true}
          />
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatrixModal;