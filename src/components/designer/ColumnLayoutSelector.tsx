import React from 'react';
import { Question } from '../../types';

interface ColumnLayoutOption {
  columns: number;
  distribution: string;
  preview: string;
}

interface ColumnLayoutSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (layout: { columns: number; distribution: string }) => void;
}

const layoutOptions: ColumnLayoutOption[] = [
  { columns: 1, distribution: '100', preview: 'w-full' },
  { columns: 2, distribution: '50-50', preview: 'w-1/2 w-1/2' },
  { columns: 2, distribution: '66-33', preview: 'w-2/3 w-1/3' },
  { columns: 2, distribution: '33-66', preview: 'w-1/3 w-2/3' },
  { columns: 3, distribution: '33-33-33', preview: 'w-1/3 w-1/3 w-1/3' },
  { columns: 4, distribution: '25-25-25-25', preview: 'w-1/4 w-1/4 w-1/4 w-1/4' },
];

const ColumnLayoutSelector: React.FC<ColumnLayoutSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Select Column Layout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {layoutOptions.map((layout, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect({
                  columns: layout.columns,
                  distribution: layout.distribution
                });
                onClose();
              }}
              className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex gap-1 h-12 mb-2">
                {layout.preview.split(' ').map((width, i) => (                  <div
                    key={i}
                    className={`${width} h-full bg-gray-200 rounded`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                {layout.columns} Column{layout.columns > 1 ? 's' : ''}<br />
                <span className="text-xs">{layout.distribution}</span>
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnLayoutSelector;
