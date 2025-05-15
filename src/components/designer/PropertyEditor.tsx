import React, { useState } from 'react';
import { Question } from '../../types';
import { Settings2, AlertCircle } from 'lucide-react';

interface PropertyEditorProps {
  question: Question;
  questions: Question[];
  onUpdate: (question: Question) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({ question, questions, onUpdate }) => {
  const [idError, setIdError] = useState<string | null>(null);

  if (!question || Object.keys(question).length === 0) {
    return null;
  }

  const handleChange = (field: string, value: any) => {
    const updatedQuestion = {
      ...question,
      [field]: value,
    };
    onUpdate(updatedQuestion);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;

    // First validate the ID
    if (!/^[a-zA-Z0-9_]+$/.test(newId)) {
      setIdError('ID can only contain letters, numbers, and underscores');
    } else if (questions.some(q => q.id === newId && q !== question)) {
      setIdError('This ID is already in use');
    } else {
      setIdError(null);
    }

    // Always update the ID regardless of validation state
    handleChange('id', newId);
  };

  const renderDependencyValueInput = (dependentQuestion: Question) => {
    switch (dependentQuestion.type) {
      case 'matrix':
        if (!dependentQuestion.matrixData) return null;
        const matrixValue = (question.condition?.value || {}) as Record<string, Record<string, boolean>>;
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dependentQuestion.matrixData?.optionsLabel || 'Options'}
                    </th>
                    {(dependentQuestion.matrixData?.columns || []).map(column => (
                      <th key={column.id} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(dependentQuestion.matrixData?.rows || []).map(row => (
                    <tr key={row.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.text}
                      </td>
                      {(dependentQuestion.matrixData?.columns || []).map(column => (
                        <td key={column.id} className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={!!matrixValue[row.id]?.[column.id]}
                            onChange={(e) => {
                              const newValue: Record<string, Record<string, boolean>> = { 
                                ...matrixValue 
                              };
                              if (!newValue[row.id]) {
                                newValue[row.id] = {};
                              }
                              if (e.target.checked) {
                                newValue[row.id][column.id] = true;
                              } else {
                                delete newValue[row.id][column.id];
                                if (Object.keys(newValue[row.id]).length === 0) {
                                  delete newValue[row.id];
                                }
                              }
                              handleChange('condition', {
                                ...question.condition,
                                value: newValue
                              });
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'multiselect':
      case 'checkbox':
        return (
          <div className="space-y-2">
            {dependentQuestion.options?.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(question.condition?.value) &&
                          question.condition.value.includes(option)}
                  onChange={(e) => {
                    const values = Array.isArray(question.condition?.value) 
                      ? [...question.condition.value]
                      : [];
                    if (e.target.checked) {
                      values.push(option);
                    } else {
                      const index = values.indexOf(option);
                      if (index > -1) values.splice(index, 1);
                    }
                    handleChange('condition', {
                      ...question.condition,
                      value: values
                    });
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'radio':
      case 'dropdown':
        return (
          <select
            value={String(question.condition?.value || '')}
            onChange={(e) => {
              handleChange('condition', {
                ...question.condition,
                value: e.target.value
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a value</option>
            {dependentQuestion.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <select
            value={String(question.condition?.value || '')}
            onChange={(e) => {
              handleChange('condition', {
                ...question.condition,
                value: e.target.value === 'true'
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a value</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={String(question.condition?.value || '')}
            onChange={(e) => {
              handleChange('condition', {
                ...question.condition,
                value: e.target.value
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
    }
  };

  return (
    <div key={question.id} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question ID</label>
          <div className="space-y-2">
            <input
              type="text"
              value={question.id}
              onChange={handleIdChange}
              className={`w-full px-3 py-2 border rounded-md ${
                idError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                idError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent`}
              placeholder="Enter unique question ID"
              autoComplete="off"
            />
            {idError && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {idError}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
          <input
            type="text"
            value={question.text}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
          <input
            type="text"
            value={question.sectionName}
            onChange={(e) => handleChange('sectionName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {question.type === 'matrix' && question.matrixData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrix Settings
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Options Label
                </label>
                <input
                  type="text"
                  value={question.matrixData.optionsLabel || 'Options'}
                  onChange={(e) => handleChange('matrixData', { 
                    ...question.matrixData, 
                    optionsLabel: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.matrixData?.showNoneOption}
                  onChange={(e) => {
                    if (!question.matrixData) return;
                    handleChange('matrixData', {
                      ...question.matrixData,
                      showNoneOption: e.target.checked,
                      rows: question.matrixData.rows.filter(row => row.id !== 'noneRow')
                    });
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Show "None of the above" option
                </label>
              </div>
              <button
                onClick={() => handleChange('isModalOpen', true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Configure Matrix
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'dropdown' || question.type === 'multiselect') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      handleChange('options', newOptions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => {
                      const newOptions = question.options?.filter((_, i) => i !== index);
                      handleChange('options', newOptions);
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(question.options || []), 'New Option'];
                  handleChange('options', newOptions);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {(question.type === 'text' || question.type === 'numeric') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
            <input
              type="number"
              value={question.min || ''}
              onChange={(e) => handleChange('min', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
            <input
              type="number"
              value={question.max || ''}
              onChange={(e) => handleChange('max', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {(question.type === 'numeric' || question.type === 'slider') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
            <input
              type="number"
              value={question.min || ''}
              onChange={(e) => handleChange('min', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Max Value</label>
            <input
              type="number"
              value={question.max || ''}
              onChange={(e) => handleChange('max', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Step</label>
            <input
              type="number"
              value={question.step || ''}
              onChange={(e) => handleChange('step', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {question.type === 'slider' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={question.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter label text"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Description</label>
            <input
              type="text"
              value={question.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter description text (optional)"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dependency</label>
          <select
            value={question.condition?.questionId || ''}
            onChange={(e) => {
              if (e.target.value === '') {
                const { condition, ...rest } = question;
                onUpdate(rest);
              } else {
                const dependentQuestion = questions.find(q => q.id === e.target.value);
                handleChange('condition', {
                  questionId: e.target.value,
                  value: dependentQuestion?.type === 'matrix' ? {} : 
                         dependentQuestion?.type === 'checkbox' ? [] : ''
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">No dependency</option>
            {questions
              .filter(q => q.id !== question.id)
              .map(q => (
                <option key={q.id} value={q.id}>
                  {q.text}
                </option>
              ))}
          </select>

          {question.condition?.questionId && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Show when answer is
              </label>
              {(() => {
                const dependentQuestion = questions.find(
                  q => q.id === question.condition?.questionId
                );
                if (!dependentQuestion) return null;

                return renderDependencyValueInput(dependentQuestion);
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;