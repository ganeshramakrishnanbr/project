import React from 'react';
import { Question } from '../../types';
import { History, RotateCcw } from 'lucide-react';

interface VersionHistoryProps {
  versions: { timestamp: number; questions: Question[] }[];
  onRestore: (version: { timestamp: number; questions: Question[] }) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, onRestore }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Version History</h2>
      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="h-12 w-12 mx-auto mb-4" />
          <p>No versions saved yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.timestamp}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  Version {versions.length - index}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(version.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {version.questions.length} questions
                </p>
              </div>
              <button
                onClick={() => onRestore(version)}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistory;