import React, { useState, useEffect } from 'react';
import { Question, MatrixColumn, MatrixRow, MatrixColumnType } from '../../types';
import { Trash, Plus, Settings2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MatrixQuestionProps {
  question: Question;
  value?: { [rowId: string]: { [columnId: string]: boolean } };
  onChange: (value: any) => void;
  required?: boolean;
  mode?: 'design' | 'preview';
  isModal?: boolean;
}

const defaultMatrixData = {
  label: 'Matrix Question',
  optionsLabel: 'Options',
  showNoneOption: true,
  columns: [
    { id: `col${Date.now()}`, label: 'Column 1', type: 'radio' as MatrixColumnType },
  ],
  rows: [
    { id: `row${Date.now()}`, text: 'Option 1', values: {} },
    { id: 'noneRow', text: 'None of the above', values: {} },
  ],
};

const SortableRow: React.FC<{
  row: MatrixRow;
  renderContent: (row: MatrixRow, dragHandlers: { attributes: any; listeners: any }) => React.ReactNode;
}> = ({ row, renderContent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {renderContent(row, { attributes, listeners })}
    </tr>
  );
};

const MatrixQuestion: React.FC<MatrixQuestionProps> = ({
  question,
  value = {},
  onChange,
  required = false,
  mode = 'preview',
  isModal = false
}) => {
  const [localMatrixData, setLocalMatrixData] = useState(question.matrixData || defaultMatrixData);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Keep localMatrixData in sync with question.matrixData and ensure deep cloning
  useEffect(() => {
    if (question.matrixData) {
      setLocalMatrixData({
        ...question.matrixData,
        columns: [...(question.matrixData.columns || [])].map(col => ({...col})),
        rows: [...(question.matrixData.rows || [])].map(row => ({...row}))
      });

      // Initialize empty value object if none exists
      if (mode === 'preview' && Object.keys(value || {}).length === 0) {
        onChange({ value: {} });
      }
    } else if (mode === 'design' && !question.matrixData) {
      const initialData = {
        ...defaultMatrixData,
        columns: [...defaultMatrixData.columns].map(col => ({...col})),
        rows: [...defaultMatrixData.rows].map(row => ({...row}))
      };
      setLocalMatrixData(initialData);
      onChange({
        ...question,
        matrixData: initialData
      });
    }
  }, [question.matrixData, mode]);

  const updateMatrixData = (newData: Partial<any>) => {
    if (mode !== 'design') return;

    const updatedData = {
      ...localMatrixData,
      ...newData,
      columns: (newData.columns || localMatrixData.columns).map((col: MatrixColumn) => ({...col})),
      rows: (newData.rows || localMatrixData.rows)
        .map((row: MatrixRow) => ({...row}))
        .sort((a: MatrixRow, b: MatrixRow) => 
          a.id === 'noneRow' ? 1 : b.id === 'noneRow' ? -1 : 0)
    };

    setLocalMatrixData(updatedData);
    onChange({
      ...question,
      matrixData: {
        ...updatedData,
        columns: [...updatedData.columns].map(col => ({...col})),
        rows: [...updatedData.rows].map(row => ({...row}))
      }
    });
  };

  const handleAddColumn = () => {
    if (!localMatrixData || mode !== 'design') return;
    
    const newColumn: MatrixColumn = {
      id: `col${Date.now()}`, // Use timestamp to ensure unique IDs
      label: `Column ${localMatrixData.columns.length + 1}`,
      type: 'radio',
    };
    
    const updatedColumns = [...(localMatrixData.columns || []), newColumn];
    updateMatrixData({
      ...localMatrixData,
      columns: updatedColumns
    });
  };

  const handleAddRow = () => {
    if (!localMatrixData || mode !== 'design') return;
    
    const newRow: MatrixRow = {
      id: `row${localMatrixData.rows.length + 1}`,
      text: `Option ${localMatrixData.rows.length}`,
      values: {},
    };
    
    const noneIndex = localMatrixData.rows.findIndex(row => row.id === 'noneRow');
    const updatedRows = [...localMatrixData.rows];
    if (noneIndex !== -1) {
      updatedRows.splice(noneIndex, 0, newRow);
    } else {
      updatedRows.push(newRow);
    }
    
    updateMatrixData({ rows: updatedRows });
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!localMatrixData || mode !== 'design') return;
    
    const updatedColumns = localMatrixData.columns.filter(col => col.id !== columnId);
    updateMatrixData({ columns: updatedColumns });
  };

  const handleDeleteRow = (rowId: string) => {
    if (!localMatrixData || mode !== 'design') return;
    
    // Allow deletion of "None of the above" row
    const updatedRows = localMatrixData.rows.filter(row => row.id !== rowId);
    updateMatrixData({ 
      rows: updatedRows,
      showNoneOption: rowId === 'noneRow' ? false : localMatrixData.showNoneOption 
    });
  };

  // Handle cell changes only in preview mode for testing relationships
  const handlePreviewCellChange = (rowId: string, columnId: string, checked: boolean) => {
    if (mode !== 'preview') return;

    const newValue = { ...value };
    
    // Initialize the row if it doesn't exist
    if (!newValue[rowId]) {
      newValue[rowId] = {};
    }

    const column = localMatrixData?.columns.find(col => col.id === columnId);
    if (!column) return;

    if (column.type === 'radio') {
      // For radio buttons, clear other selections in the same row
      if (checked) {
        // Clear existing selections for this row
        Object.keys(newValue[rowId]).forEach(key => {
          delete newValue[rowId][key];
        });
        // Set the new selection
        newValue[rowId][columnId] = true;
      }
    } else {
      // For checkboxes, just toggle the value
      if (checked) {
        newValue[rowId][columnId] = true;
      } else {
        delete newValue[rowId][columnId];
        // Clean up empty rows
        if (Object.keys(newValue[rowId]).length === 0) {
          delete newValue[rowId];
        }
      }
    }

    // Special handling for "None of the above"
    if (rowId === 'noneRow') {
      if (checked) {
        // Clear all other selections when "None of the above" is selected
        Object.keys(newValue).forEach(key => {
          if (key !== 'noneRow') {
            delete newValue[key];
          }
        });
      }
    } else if (checked) {
      // When selecting any other option, clear "None of the above"
      if (newValue['noneRow']) {
        delete newValue['noneRow'];
      }
    }

    onChange({ value: newValue });
  };

  const handleColumnTypeChange = (columnId: string, type: MatrixColumnType) => {
    if (!localMatrixData || mode !== 'design') return;
    
    const updatedColumns = localMatrixData.columns.map(col => 
      col.id === columnId ? { ...col, type } : col
    );
    
    updateMatrixData({ columns: updatedColumns });

    if (type === 'radio') {
      const newValues = { ...value };
      Object.keys(newValues).forEach(rowId => {
        const selectedColumns = Object.entries(newValues[rowId])
          .filter(([, isChecked]) => isChecked)
          .map(([colId]) => colId);
        
        if (selectedColumns.length > 1) {
          newValues[rowId] = { [selectedColumns[0]]: true };
        }
      });
      onChange({ values: newValues });
    }
  };

  const handleColumnLabelChange = (columnId: string, newLabel: string) => {
    if (!localMatrixData || mode !== 'design') return;
    
    const updatedColumns = localMatrixData.columns.map(col => 
      col.id === columnId ? { ...col, label: newLabel } : col
    );
    
    updateMatrixData({ columns: updatedColumns });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || active.id === 'noneRow' || over.id === 'noneRow') return;

    const oldIndex = localMatrixData.rows.findIndex(row => row.id === active.id);
    const newIndex = localMatrixData.rows.findIndex(row => row.id === over.id);

    const updatedRows = arrayMove(localMatrixData.rows, oldIndex, newIndex);
    updateMatrixData({ rows: updatedRows });
  };

  const renderRows = () => {
    const rows = localMatrixData?.rows || [];
    
    // Filter out any existing "None of the above" rows first
    const normalRows = rows.filter(row => row.id !== 'noneRow');
    
    // Create the display rows array
    const displayRows = [...normalRows];
    
    // Add "None of the above" row if enabled
    if (localMatrixData?.showNoneOption) {
      displayRows.push({
        id: 'noneRow',
        text: 'None of the above',
        values: {}
      });
    }

    const renderRowContent = (row: MatrixRow, dragHandlers?: { attributes: any; listeners: any }) => (
      <>
        <td className="px-4 py-2 flex items-center">
          {mode === 'design' && row.id !== 'noneRow' && dragHandlers && (
            <span {...dragHandlers.attributes} {...dragHandlers.listeners} className="cursor-move mr-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </span>
          )}
          {mode === 'design' && row.id !== 'noneRow' ? (
            <input
              type="text"
              value={row.text}
              onChange={(e) => {
                const updatedRows = localMatrixData.rows.map(r => 
                  r.id === row.id ? { ...r, text: e.target.value } : r
                );
                updateMatrixData({ rows: updatedRows });
              }}
              className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <span className="text-gray-900">{row.text}</span>
          )}
        </td>
        {(localMatrixData?.columns || []).map((column) => (
          <td key={column.id} className="px-4 py-2 text-center">
            <input
              type={column.type === 'radio' ? 'radio' : 'checkbox'}
              name={column.type === 'radio' ? `matrix_${question.id}_${row.id}` : undefined}
              checked={value[row.id]?.[column.id] || false}
              onChange={(e) => handlePreviewCellChange(row.id, column.id, e.target.checked)}
              disabled={mode !== 'preview'}
              className={`h-4 w-4 ${column.type === 'radio' ? 'form-radio' : 'form-checkbox'} text-blue-600 border-gray-300 focus:ring-blue-500`}
            />
          </td>
        ))}
        {mode === 'design' && row.id !== 'noneRow' && (
          <td className="px-4 py-2">
            <button
              onClick={() => handleDeleteRow(row.id)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete row"
            >
              <Trash className="h-4 w-4" />
            </button>
          </td>
        )}
      </>
    );

    return displayRows.map((row) => (
      row.id === 'noneRow' ? (
        <tr key={row.id} className="border-b bg-gray-50">
          {renderRowContent(row)}
        </tr>
      ) : (
        <SortableRow key={row.id} row={row} renderContent={renderRowContent} />
      )
    ));
  };

  const renderMatrixContent = () => (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-y-auto overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] w-1/4">
                {localMatrixData?.optionsLabel || 'Options'}
              </th>
              {localMatrixData?.columns.map((column) => (
                <th key={column.id} scope="col" className="px-6 py-3 min-w-[150px]">
                  <div className="flex flex-col items-center space-y-2">
                    {mode === 'design' ? (
                      <>
                        <input
                          type="text"
                          value={column.label}
                          onChange={(e) => handleColumnLabelChange(column.id, e.target.value)}
                          className="w-full text-sm p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={column.type}
                          onChange={(e) => handleColumnTypeChange(column.id, e.target.value as MatrixColumnType)}
                          className="w-full text-sm p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        {localMatrixData.columns.length > 1 && (
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete column"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{column.label}</span>
                    )}
                  </div>
                </th>
              ))}
              {mode === 'design' && (
                <th scope="col" className="px-6 py-3 w-20">
                  <button
                    onClick={handleAddColumn}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Add column"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderRows()}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-4">
        {localMatrixData?.label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {mode === 'design' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            {!isModal && (
              <button
                onClick={() => onChange({ ...question, isModalOpen: true })}
                className="flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-500 rounded-md hover:bg-blue-50"
              >
                <Settings2 className="h-5 w-5 mr-2" />
                Configure Matrix
              </button>
            )}
            <button
              onClick={handleAddRow}
              className="flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-500 rounded-md hover:bg-blue-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Option
            </button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localMatrixData?.rows?.filter(row => row.id !== 'noneRow').map(row => row.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {renderMatrixContent()}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="preview-mode">
          {renderMatrixContent()}
        </div>
      )}
    </div>
  );
};

export default MatrixQuestion;