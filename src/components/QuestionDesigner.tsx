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
import ColumnLayoutSelector from './designer/ColumnLayoutSelector';
import { useQuestions } from '../context/QuestionsContext';

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
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const pendingColumnQuestion = useRef<DesignerQuestion | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const { templates, updateTemplate } = useQuestions();

  // Helper function to update context
  const updateContextWithCurrentQuestions = (currentQuestions: DesignerQuestion[]) => {
    if (templates.length > 0 && updateTemplate) {
      const activeTemplate = templates[0]; // Assuming we edit the first template
      // Filter out any potential undefined questions before updating
      const validQuestions = currentQuestions.filter(q => q !== null && q !== undefined);
      console.log('[QuestionDesigner] Updating context with questions:', JSON.parse(JSON.stringify(validQuestions)));
      updateTemplate(activeTemplate.state, { ...activeTemplate, questions: validQuestions });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        updateContextWithCurrentQuestions(newItems);
        return newItems;
      });
    }
  };

  // Delay setting the selectedQuestion until the new control has valid properties
  const handleAddQuestion = (type: QuestionType, withConfig?: boolean) => {
    const newQuestion: DesignerQuestion = {
      id: `question_${Date.now()}`,
      text: type === 'columns' ? 'Column Layout' : 'New Question',
      sectionName: 'Default Section',
      type,
      options: type === 'radio' || type === 'checkbox' || type === 'dropdown' || type === 'multiselect' 
        ? ['Option 1'] 
        : undefined,
      min: type === 'slider' ? 0 : undefined,
      max: type === 'slider' ? 100 : undefined,
      step: type === 'slider' ? 1 : undefined,
      label: type === 'slider' ? 'Slider Question' : undefined,
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

    if (type === 'columns') {
      pendingColumnQuestion.current = {
        ...newQuestion,
        isColumnContainer: true
      };
      setShowColumnSelector(true);
    } else {
      addQuestionToCanvas(newQuestion);
    }
  };

  const addQuestionToCanvas = (question: DesignerQuestion) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, question];
      setSelectedQuestion(question);
      updateContextWithCurrentQuestions(updatedQuestions);
      return updatedQuestions;
    });
  };

  const handleColumnLayoutSelect = (layout: { columns: number; distribution: string }) => {
    if (pendingColumnQuestion.current) {
      const questionWithLayout = {
        ...pendingColumnQuestion.current,
        columnLayout: {
          ...layout,
          children: {}
        }
      };
      addQuestionToCanvas(questionWithLayout);
      pendingColumnQuestion.current = null;
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    console.log('[QuestionDesigner] handleUpdateQuestion: Received updatedQuestion:', JSON.parse(JSON.stringify(updatedQuestion)));
    
    setQuestions(prevQuestions => {
      console.log('[QuestionDesigner] handleUpdateQuestion: prevQuestions:', JSON.parse(JSON.stringify(prevQuestions)));
      
      const isUpdatingContainer = prevQuestions.some(q => q.id === updatedQuestion.id && q.type === 'columns');
      const isUpdatingChildParentInfo = !isUpdatingContainer && updatedQuestion.parentId;

      let newQuestionsState: DesignerQuestion[];

      if (isUpdatingContainer && updatedQuestion.columnLayout && updatedQuestion.type === 'columns') {
        // This is an update to a column container itself, and new layout info is provided.
        newQuestionsState = prevQuestions.map(q => {
          if (q.id === updatedQuestion.id) {
            console.log(`[QuestionDesigner] handleUpdateQuestion: Updating container ${q.id} with new layout children.`);
            
            // Properties from updatedQuestion, excluding its columnLayout which we'll build carefully.
            const { columnLayout: _, ...otherUpdatedProps } = updatedQuestion;

            const newDesignerQuestion: DesignerQuestion = {
              ...q, // Start with existing DesignerQuestion properties
              ...otherUpdatedProps, // Apply other updated properties
              type: 'columns', // Ensure type is columns
              columnLayout: { // Construct the columnLayout carefully
                columns: updatedQuestion.columnLayout.columns, // This is 'number'
                distribution: updatedQuestion.columnLayout.distribution, // This is 'string'
                children: { ...(updatedQuestion.columnLayout.children || {}) },
              },
            };
            return newDesignerQuestion;
          }
          return q;
        });
      } else if (isUpdatingChildParentInfo) {
        newQuestionsState = prevQuestions.map(q => {
          if (q.id === updatedQuestion.id) {
            console.log(`[QuestionDesigner] handleUpdateQuestion: Updating child ${q.id} with new parent/column info.`);
            return { ...q, ...updatedQuestion }; 
          }
          return q;
        });
      } else {
        newQuestionsState = prevQuestions.map(q => {
          if (q.id === updatedQuestion.id) {
            console.log(`[QuestionDesigner] handleUpdateQuestion: General update for question ${q.id}.`);
            if (updatedQuestion.parentId === undefined && q.parentId) {
               console.log(`[QuestionDesigner] handleUpdateQuestion: Question ${q.id} moved out of column ${q.parentId}.`);
            }
            // Ensure matrixData is handled immutably if present
            const matrixData = updatedQuestion.matrixData ? {
              ...updatedQuestion.matrixData,
              columns: [...(updatedQuestion.matrixData.columns || [])].map(col => ({...col})),
              rows: [...(updatedQuestion.matrixData.rows || [])].map(row => ({...row}))
            } : undefined;

            // If the type changes away from 'columns', columnLayout should be removed.
            // Or if it's a general update to a 'columns' type question not affecting layout structure directly via updatedQuestion.columnLayout.
            const baseUpdate = { ...q, ...updatedQuestion, matrixData };

            if (baseUpdate.type !== 'columns') {
              delete baseUpdate.columnLayout;
            } else if (baseUpdate.type === 'columns' && !baseUpdate.columnLayout && q.columnLayout) {
              // If it's still a column type, but updatedQuestion didn't provide a columnLayout,
              // retain the existing q.columnLayout. This happens if only e.g. text of column container changes.
              baseUpdate.columnLayout = q.columnLayout;
            } else if (baseUpdate.type === 'columns' && !baseUpdate.columnLayout && !q.columnLayout) {
              // This case implies it's a column type but has no layout defined yet.
              // This might happen if a new 'columns' question is added but layout selection is pending,
              // though handleAddQuestion and handleColumnLayoutSelect should manage this.
              // For safety, ensure it's at least an empty object if it's a column type.
              // However, the type Question allows columnLayout to be undefined.
              // So, we only define it if it's meaningful.
            }
            return baseUpdate;
          }
          return q;
        });
      }

      console.log('[QuestionDesigner] handleUpdateQuestion: newQuestionsState:', JSON.parse(JSON.stringify(newQuestionsState)));
      
      // Update selected question if it was the one modified
      if (selectedQuestion && selectedQuestion.id === updatedQuestion.id) {
        const newlySelected = newQuestionsState.find(q => q.id === updatedQuestion.id) || null;
        console.log('[QuestionDesigner] handleUpdateQuestion: Updating selectedQuestion:', newlySelected ? JSON.parse(JSON.stringify(newlySelected)) : null);
        setSelectedQuestion(newlySelected);
      }
      updateContextWithCurrentQuestions(newQuestionsState);
      return newQuestionsState;
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const newQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(newQuestions);
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
    }
    updateContextWithCurrentQuestions(newQuestions);
  };

  const handleSaveVersion = () => {
    const newVersion = {
      timestamp: Date.now(),
      questions: [...questions],
    };
    setVersions([...versions, newVersion]);
  };

  const handleRestoreVersion = (version: { timestamp: number; questions: Question[] }) => {
    const restoredQuestions = [...version.questions] as DesignerQuestion[];
    setQuestions(restoredQuestions);
    updateContextWithCurrentQuestions(restoredQuestions);
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

        setQuestions(parsedQuestions as DesignerQuestion[]);
        setSelectedQuestion(null);
        updateContextWithCurrentQuestions(parsedQuestions as DesignerQuestion[]);
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
    <div className="min-h-screen bg-gray-100">
      <ColumnLayoutSelector
        isOpen={showColumnSelector}
        onClose={() => setShowColumnSelector(false)}
        onSelect={handleColumnLayoutSelect}
      />
      {/* Sticky header with shadow */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-[98rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('design')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'design' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4 inline-block mr-2" />
                Design
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'preview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4 inline-block mr-2" />
                Preview
              </button>
              <button
                onClick={generateJson}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'json' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Code className="h-4 w-4 inline-block mr-2" />
                JSON
              </button>
              <button
                onClick={() => setMode('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'history' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <History className="h-4 w-4 inline-block mr-2" />
                History
              </button>
            </div>
            <div className="flex items-center space-x-3">
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
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer flex items-center transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </label>
              <button
                onClick={handleSaveVersion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Save className="h-4 w-4 inline-block mr-2" />
                Save Version
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-[98rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {importError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
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
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="grid grid-cols-12 divide-x min-h-[calc(100vh-12rem)]">
                {/* Left Panel - Controls */}
                <div className="col-span-2 h-full flex flex-col">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-sm font-medium text-gray-900">Controls</h2>
                  </div>
                  <div className="flex-1 p-4 overflow-hidden">
                    <ControlPanel onAddQuestion={handleAddQuestion} />
                  </div>
                </div>

                {/* Center Panel - Canvas */}
                <div className="col-span-7 h-full flex flex-col">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-sm font-medium text-gray-900">Question Canvas</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <DesignCanvas
                      questions={questions}
                      selectedQuestion={selectedQuestion}
                      onSelectQuestion={setSelectedQuestion}
                      onUpdateQuestion={handleUpdateQuestion}
                      onDeleteQuestion={handleDeleteQuestion}
                    />
                  </div>
                </div>

                {/* Right Panel - Properties */}
                <div className="col-span-3 h-full flex flex-col">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-sm font-medium text-gray-900">Properties</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {selectedQuestion ? (
                      <PropertyEditor
                        question={selectedQuestion}
                        questions={questions}
                        onUpdate={handleUpdateQuestion}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        <p>Select a question to edit its properties</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DndContext>
        )}

        {mode === 'preview' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <QuestionPreview 
              questions={templates.length > 0 && templates[0].questions ? templates[0].questions : []}
            />
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
      {showColumnSelector && (
        <ColumnLayoutSelector
          isOpen={showColumnSelector}
          onClose={() => setShowColumnSelector(false)}
          onSelect={handleColumnLayoutSelect}
        />
      )}
    </div>
  );
};

export default QuestionDesigner;