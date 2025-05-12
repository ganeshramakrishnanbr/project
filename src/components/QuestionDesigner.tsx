import React, { useState, useRef } from 'react';
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Question, QuestionType } from '../types';
import { Save, Copy, Settings, Eye, Code, History, Upload, AlertCircle } from 'lucide-react';
import ControlPanel from './designer/ControlPanel';
import DesignCanvas from './designer/DesignCanvas';
import PropertyEditor from './designer/PropertyEditor';
import QuestionPreview from './designer/QuestionPreview';
import VersionHistory from './designer/VersionHistory';
import MatrixModal from './questions/MatrixModal';

interface DesignerQuestion extends Question {
  isModalOpen?: boolean;
}

const QuestionDesigner: React.FC = () => {
  const [questions, setQuestions] = useState<DesignerQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<DesignerQuestion | null>(null);
  const [mode, setMode] = useState<'design' | 'preview' | 'json' | 'history'>('design');
  const [versions, setVersions] = useState<{ timestamp: number; questions: Question[] }[]>([]);
  const [jsonOutput, setJsonOutput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Delay setting the selectedQuestion until the new control has valid properties
  const handleAddQuestion = (type: QuestionType, withConfig?: boolean) => {
    const newQuestion: DesignerQuestion = {
      id: `question_${Date.now()}`,
      text: 'New Question',
      sectionName: 'Default Section',
      type,
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' ? ['Option 1'] : undefined,
      matrixData: type === 'matrix' ? {
        label: 'Matrix Question',
        columns: [
          { id: 'col1', label: 'Column 1', type: 'radio' }
        ],
        rows: [
          { id: 'row1', text: 'Option 1', values: {} },
          { id: 'noneRow', text: 'None of the above', values: {} }
        ]
      } : undefined,
      isModalOpen: type === 'matrix' && withConfig ? true : undefined
    };
    
    // Update questions and select the new question immediately
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, newQuestion];
      // Set the selected question in a callback to ensure it happens after questions are updated
      setSelectedQuestion(newQuestion);
      return updatedQuestions;
    });
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    // Find the question being updated
    const oldQuestion = questions.find(q => q.id === updatedQuestion.id || q === selectedQuestion);
    if (!oldQuestion) return;

    // Update questions array
    const updatedQuestions = questions.map(q => {
      if (q === oldQuestion) {
        // This is the question being updated
        return {
          ...updatedQuestion,
          matrixData: updatedQuestion.matrixData ? {
            ...updatedQuestion.matrixData,
            label: updatedQuestion.matrixData.label || 'Matrix Question',
            optionsLabel: updatedQuestion.matrixData.optionsLabel || 'Options',
            showNoneOption: updatedQuestion.matrixData.showNoneOption ?? true,
            columns: [...(updatedQuestion.matrixData.columns || [])].map(col => ({...col})),
            rows: [...(updatedQuestion.matrixData.rows || [])].map(row => ({...row}))
          } : undefined
        };
      }

      // Update any dependencies if the ID changed
      if (oldQuestion.id !== updatedQuestion.id && q.condition?.questionId === oldQuestion.id) {
        return {
          ...q,
          condition: {
            ...q.condition,
            questionId: updatedQuestion.id
          }
        };
      }

      return q;
    });

    setQuestions(updatedQuestions);

    // Update selected question
    if (selectedQuestion && selectedQuestion.id === oldQuestion.id) {
      setSelectedQuestion(updatedQuestions.find(q => q.id === updatedQuestion.id) || null);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
    }
  };

  const handleSaveVersion = () => {
    const newVersion = {
      timestamp: Date.now(),
      questions: [...questions],
    };
    setVersions([...versions, newVersion]);
  };

  const handleRestoreVersion = (version: { timestamp: number; questions: Question[] }) => {
    setQuestions([...version.questions]);
    setMode('design');
  };

  const generateJson = () => {
    const output = JSON.stringify(questions, null, 2);
    setJsonOutput(output);
    setMode('json');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const parsedQuestions = JSON.parse(jsonContent) as Question[];
        
        // Validate the JSON structure
        if (!Array.isArray(parsedQuestions)) {
          throw new Error('Invalid JSON format: Expected an array of questions');
        }

        // Validate each question has required properties
        parsedQuestions.forEach((question, index) => {
          if (!question.id || !question.text || !question.type) {
            throw new Error(`Invalid question at index ${index}: Missing required properties`);
          }
        });

        setQuestions(parsedQuestions);
        setSelectedQuestion(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to parse JSON file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleModalClose = (questionId: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, isModalOpen: false } : q
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setMode('design')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  mode === 'design' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="h-5 w-5 inline-block mr-2" />
                Design
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  mode === 'preview' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="h-5 w-5 inline-block mr-2" />
                Preview
              </button>
              <button
                onClick={generateJson}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  mode === 'json' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="h-5 w-5 inline-block mr-2" />
                JSON
              </button>
              <button
                onClick={() => setMode('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  mode === 'history' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <History className="h-5 w-5 inline-block mr-2" />
                History
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                ref={fileInputRef}
                className="hidden"
                id="json-import"
              />
              <label
                htmlFor="json-import"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </label>
              <button
                onClick={handleSaveVersion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save className="h-4 w-4 inline-block mr-2" />
                Save Version
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {importError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Error importing JSON</p>
              <p className="text-sm">{importError}</p>
              <p className="text-sm mt-1">Please use the drag and drop interface to create your questions.</p>
            </div>
          </div>
        )}
        
        {mode === 'design' && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel for Design Controls - now 2 columns */}
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
                  <div className="space-y-4">
                    <ControlPanel onAddQuestion={handleAddQuestion} />
                  </div>
                </div>
                
                {/* Center Panel for Question Canvas - now 7 columns */}
                <div className="col-span-7 bg-gray-50 p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
                  <DesignCanvas
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    onSelectQuestion={setSelectedQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                </div>

                {/* Right Panel for Properties - now 3 columns */}
                <div className="col-span-3 bg-gray-50 p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
                  {selectedQuestion ? (
                    <div className="bg-white p-4 rounded-lg shadow w-full">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Question Properties</h3>
                      <PropertyEditor
                        question={selectedQuestion}
                        questions={questions}
                        onUpdate={handleUpdateQuestion}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg shadow h-full flex items-center justify-center text-gray-500">
                      <p>Select a question to edit its properties</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DndContext>
        )}

        {mode === 'preview' && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-full">
            <QuestionPreview questions={questions} />
          </div>
        )}

        {mode === 'json' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Generated JSON</h3>
              <button
                onClick={() => navigator.clipboard.writeText(jsonOutput)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <Copy className="h-4 w-4 inline-block mr-1" />
                Copy
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
              {jsonOutput}
            </pre>
          </div>
        )}

        {mode === 'history' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <VersionHistory versions={versions} onRestore={handleRestoreVersion} />
          </div>
        )}
      </div>
      {questions.map(question => (
        question.type === 'matrix' && question.isModalOpen && (
          <MatrixModal
            key={`modal_${question.id}`}
            isOpen={true}
            onClose={() => handleModalClose(question.id)}
            question={question}
            onChange={handleUpdateQuestion}
          />
        )
      ))}
    </div>
  );
};

export default QuestionDesigner;