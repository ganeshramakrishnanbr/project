import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../types';
import { GripVertical, Trash, Asterisk } from 'lucide-react';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  // arrayMove // No longer used here, handled by parent
} from '@dnd-kit/sortable';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';

interface DesignCanvasProps {
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

// Helper function to get column children
const getColumnChildren = (container: Question, columnIndex: number): string[] => {
  if (!container.columnLayout?.children) return [];
  return container.columnLayout.children[columnIndex] || [];
};

// Helper function to update column children
const updateColumnChildren = (container: Question, columnIndex: number, children: string[]): Question => {
  if (!container.columnLayout) return container;
  return {
    ...container,
    columnLayout: {
      ...container.columnLayout,
      children: {
        ...container.columnLayout.children,
        [columnIndex]: children
      }
    }
  };
};

const SortableQuestion: React.FC<{
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (question: Question) => void;
}> = ({ question, isSelected, onSelect, onDelete, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: question.id,
    data: {
      type: question.type,
      parentId: question.parentId,
      columnIndex: question.columnIndex
    }
  });

  const isInColumn = !!question.parentId;
  console.log(`SortableQuestion Render: id=${question.id}, isInColumn=${isInColumn}, parentId=${question.parentId}, columnIndex=${question.columnIndex}, text='${question.text}', isDragging=${isDragging}`);

  const baseSortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    position: 'relative',
    cursor: 'move',
    touchAction: 'none',
    marginBottom: '1rem',
  };

  const dynamicStyles: React.CSSProperties = isDragging
    ? { 
        opacity: 0.5, // Keep it slightly visible for debugging overlay issues
        visibility: 'visible', // Keep it visible to see if it's just an opacity issue
        zIndex: -1, 
      }
    : { 
        opacity: 1,
        visibility: 'visible',
        display: 'block', 
        zIndex: isInColumn ? 100 : 1, 
        ...(isInColumn && { 
          backgroundColor: 'hotpink',
          border: '3px solid red',
          minHeight: '50px',
          minWidth: '90%',
          color: 'black',
          padding: '10px',
          boxSizing: 'border-box',
          margin: '5px auto'
        })
      };

  const combinedStyle = { ...baseSortableStyle, ...dynamicStyles };

  const handleToggleRequired = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...question,
      required: !question.required
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle} // Use the combined style
      {...attributes}
      {...listeners}
      // className no longer needs mb-4 as it's in combinedStyle.
      // transition-colors is for selection feedback.
      className={`bg-white border rounded-lg p-4 transition-colors ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{question.text}</h3>
            <p className="text-sm text-gray-500">{question.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleRequired}
            className={`p-1 ${question.required ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            title={question.required ? 'Make optional' : 'Make required'}
          >
            <Asterisk className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Delete question"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DroppableColumn: React.FC<{
  id: string;
  index: number;
  width: number;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ id, index, width, isActive, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      accepts: ['numeric', 'boolean', 'text', 'medication', 'time', 'radio', 'checkbox', 'date', 'dropdown', 'matrix', 'multiselect', 'toggle', 'slider']
    }
  });

  return (    <div className={`px-2 ${width === 33 ? 'w-1/3' : 
                           width === 25 ? 'w-1/4' : 
                           width === 66 ? 'w-2/3' : 
                           width === 50 ? 'w-1/2' : 'w-full'}`}>
      <div 
        ref={setNodeRef}
        data-droppable="column"
        data-column-id={id}
        style={{ 
          zIndex: isOver ? 2 : 0 
        }}
        className={`min-h-[100px] border-dashed border-2 ${
          isActive || isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } rounded-lg p-4 transition-all transform ${
          isOver ? 'scale-[1.02]' : ''
        }`}
      >
        <div className="text-center text-gray-500 text-sm py-2 select-none">Column {index + 1}</div>
        <div 
          className="space-y-4" 
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            overflow: 'visible'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ColumnLayout: React.FC<{
  columnQuestion: Question;
  questions: Question[];
  selectedQuestion: Question | null;
  dragOverColumnId: string | null;
  onSelectQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (q: Question) => void;
}> = ({ columnQuestion, questions, selectedQuestion, dragOverColumnId, onSelectQuestion, onDeleteQuestion, onUpdateQuestion }) => {
  const layout = columnQuestion.columnLayout;
  if (!layout) return null;

  const distribution = layout.distribution.replace(/%/g, '').split('-').map(Number);
  const children = layout.children || {};
  console.log(`ColumnLayout Render: id=${columnQuestion.id}, layoutChildren=${JSON.stringify(children)}, dragOverColumnId=${dragOverColumnId}`);

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            Object.values(children).flat().forEach(id => onDeleteQuestion(id));
            onDeleteQuestion(columnQuestion.id);
          }}
          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
          title="Delete column layout"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <div className="flex -mx-2">
        {distribution.map((width, index) => {
          const columnItems = children[index] || [];
          const columnId = `${columnQuestion.id}column-${index}`;
          const columnQuestions = columnItems
            .map(id => questions.find(q => q.id === id))
            .filter((q): q is Question => q !== undefined);
          
          console.log(`ColumnLayout (${columnQuestion.id}) - Column ${index} (id: ${columnId}): itemIds=${JSON.stringify(columnItems)}, resolvedQuestionsCount=${columnQuestions.length}, questionTexts=${JSON.stringify(columnQuestions.map(cq => cq.text))}`);

          return (
            <DroppableColumn
              key={index} // Consider using columnId for key if index can change due to distribution changes
              id={columnId}
              index={index}
              width={width}
              isActive={dragOverColumnId === columnId}
            >
              <SortableContext items={columnQuestions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                {columnQuestions.map((q) => (
                  <SortableQuestion
                    key={q.id}
                    question={q}
                    isSelected={selectedQuestion?.id === q.id}
                    onSelect={() => onSelectQuestion(q)}
                    onDelete={() => onDeleteQuestion(q.id)}
                    onUpdate={onUpdateQuestion}
                  />
                ))}
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
    </div>
  );
};

// Main component implementation
export default function DesignCanvas({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: DesignCanvasProps): JSX.Element { // Added JSX.Element return type
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = React.useState<string | null>(null);
  const [draggingQuestion, setDraggingQuestion] = React.useState<Question | null>(null);
  
  const topLevelQuestions = questions.filter(q => !q.parentId);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const question = questions.find(q => q.id === active.id);
    if (question) {
      setDraggingQuestion(question);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverColumnId(null);

    console.log('[DesignCanvas] handleDragEnd: Start', { activeId: active.id, overId: over?.id });

    if (!over) {
      console.log('[DesignCanvas] handleDragEnd: No "over" target. Exiting.');
      return;
    }

    const questionId = active.id as string;
    const question = questions.find(q => q.id === questionId);

    if (!question) {
      console.log(`[DesignCanvas] handleDragEnd: Question with id ${questionId} not found. Exiting.`);
      return;
    }
    if (question.type === 'columns') {
      console.log('[DesignCanvas] handleDragEnd: Question is a column layout, cannot be dropped into another column. Exiting.');
      return;
    }

    const overId = over.id as string;
    
    // Handle drops into columns
    if (overId.includes('column-')) {
      const [containerId, columnIndexStr] = overId.split('column-');
      const containerQuestion = questions.find(q => q.id === containerId);
      
      console.log('[DesignCanvas] handleDragEnd: Attempting drop into column.', { questionId, containerId, columnIndexStr });

      if (!containerQuestion?.columnLayout || containerQuestion.type !== 'columns') {
        console.log('[DesignCanvas] handleDragEnd: Invalid container or container is not a column layout.', { containerId, containerType: containerQuestion?.type });
        return;
      }

      const allowedTypes = ['numeric', 'boolean', 'text', 'medication', 'time', 'radio', 
                           'checkbox', 'date', 'dropdown', 'matrix', 'multiselect', 'toggle', 'slider'];
      if (!allowedTypes.includes(question.type)) {
        console.log(`[DesignCanvas] handleDragEnd: Question type "${question.type}" not allowed in columns. Exiting.`);
        return;
      }

      console.log('[DesignCanvas] handleDragEnd: Dropping question into column - VALIDATED.', { questionId, containerId, columnIndex: columnIndexStr });

      // Remove from old container if exists
      if (question.parentId) {
        const oldParent = questions.find(q => q.id === question.parentId);
        if (oldParent?.columnLayout?.children) {
          const oldColumnIndex = question.columnIndex || 0;
          const oldChildren = getColumnChildren(oldParent, oldColumnIndex);
          const newOldParentChildren = oldChildren.filter(id => id !== questionId);
          const updatedOldParent = updateColumnChildren(oldParent, oldColumnIndex, newOldParentChildren);
          console.log('[DesignCanvas] handleDragEnd: Removing from old parent.', { oldParentId: oldParent.id, oldColumnIndex, newOldParentChildren });
          onUpdateQuestion(updatedOldParent);
        }
      }

      // Add to new container
      const columnIndex = parseInt(columnIndexStr);
      const currentChildrenInNewColumn = getColumnChildren(containerQuestion, columnIndex);
      // Ensure no duplicates if somehow it's already there (defensive)
      const newChildrenInNewColumn = [...currentChildrenInNewColumn.filter(id => id !== questionId), questionId];
      const updatedNewParent = updateColumnChildren(containerQuestion, columnIndex, newChildrenInNewColumn);
      console.log('[DesignCanvas] handleDragEnd: Adding to new parent.', { newParentId: containerQuestion.id, columnIndex, newChildrenInNewColumn });
      onUpdateQuestion(updatedNewParent);

      // Update question's parent reference
      const updatedQuestionWithParentInfo = {
        ...question,
        parentId: containerQuestion.id,
        columnIndex: columnIndex
      };
      console.log('[DesignCanvas] handleDragEnd: Updating question parent info.', updatedQuestionWithParentInfo);
      onUpdateQuestion(updatedQuestionWithParentInfo);

    } else if (question.parentId) {
      // If dragging from a column to the main area
      console.log('[DesignCanvas] handleDragEnd: Dragging from column to main area.', { questionId, oldParentId: question.parentId });
      const parent = questions.find(q => q.id === question.parentId);
      if (parent?.columnLayout?.children) {
        const columnIndex = question.columnIndex || 0;
        const children = getColumnChildren(parent, columnIndex);
        const newParentChildren = children.filter(id => id !== questionId);
        const updatedOldParent = updateColumnChildren(parent, columnIndex, newParentChildren);
        console.log('[DesignCanvas] handleDragEnd: Removing from old parent (drag to main).', { oldParentId: parent.id, columnIndex, newParentChildren });
        onUpdateQuestion(updatedOldParent);
      }
      
      const updatedQuestionWithoutParentInfo = {
        ...question,
        parentId: undefined,
        columnIndex: undefined
      };
      console.log('[DesignCanvas] handleDragEnd: Removing parent info from question.', updatedQuestionWithoutParentInfo);
      onUpdateQuestion(updatedQuestionWithoutParentInfo);

    } else if (active.id !== over.id && !overId.includes('column-')) {
      // Handle reordering at the top level
      console.log('[DesignCanvas] handleDragEnd: Reordering at top level.', { activeId: active.id, overId: over.id });
      const oldIndex = topLevelQuestions.findIndex(q => q.id === active.id);
      const newIndex = topLevelQuestions.findIndex(q => q.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // This part needs careful handling of the main questions array,
        // arrayMove might not be sufficient if other updates are batched.
        // For now, assuming direct update or a more sophisticated state update in QuestionDesigner
        // const reorderedQuestions = arrayMove(questions, oldIndex, newIndex); // This moves within the *entire* questions array - COMMENTED OUT
        console.log('[DesignCanvas] handleDragEnd: Top level reorder - old/new indices:', { oldIndex, newIndex });
        // It's generally better to let the parent component manage the full state update for reordering.
        // This might need a different callback like onReorderQuestions(oldIndex, newIndex)
        // For now, if onUpdateQuestion is smart enough to handle this, it might work, but it's risky.
        // A safer approach for reordering is to pass the new array or indices to the parent.
        // Let's assume `onUpdateQuestion` is primarily for single item updates.
        // A dedicated reorder function would be better.
        // For now, this might cause issues if not handled carefully by the parent.
         alert("Top-level reordering logic is handled by QuestionDesigner. This alert is a placeholder.");
         // questions.forEach((q: Question) => onUpdateQuestion(q)); // This is likely incorrect for reordering the whole list
      }
    }
    console.log('[DesignCanvas] handleDragEnd: End');
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={({ active, over }) => {
        if (over?.id && typeof over.id === 'string' && over.id.includes('column-')) {
          const question = questions.find(q => q.id === active.id);
          if (question && question.type !== 'columns') {
            setDragOverColumnId(over.id);
            return;
          }
        }
        setDragOverColumnId(null);
      }}
    >
      <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 min-h-[600px] relative">
        {questions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Drag and drop questions here
          </div>
        ) : (
          <SortableContext items={topLevelQuestions.map(q => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {topLevelQuestions.map((question) => (
                question.type === 'columns' ? (
                  <ColumnLayout
                    key={question.id}
                    columnQuestion={question}
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    dragOverColumnId={dragOverColumnId} // Ensured dragOverColumnId is passed
                    onSelectQuestion={onSelectQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onUpdateQuestion={onUpdateQuestion}
                  />
                ) : (
                  <SortableQuestion
                    key={question.id}
                    question={question}
                    isSelected={selectedQuestion?.id === question.id}
                    onSelect={() => onSelectQuestion(question)}
                    onDelete={() => onDeleteQuestion(question.id)}
                    onUpdate={onUpdateQuestion}
                  />
                )
              ))}
            </div>
          </SortableContext>
        )}
      </div>      <DragOverlay 
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{
          transformOrigin: '0 0',
          zIndex: 1000,
        }}
      >
        {activeId && draggingQuestion && (
          <div 
            className="bg-white border rounded-lg p-4 shadow-xl" 
            style={{
              transform: 'scale(1.05)',
              pointerEvents: 'none',
              width: 'auto',
              maxWidth: '100%',
              position: 'relative',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">
                  {questions.find(q => q.id === activeId)?.text}
                </h3>
                <p className="text-sm text-gray-500">
                  {questions.find(q => q.id === activeId)?.type}
                </p>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
