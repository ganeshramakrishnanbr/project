import React, { useState } from 'react';
import { Question, Medication } from '../../types';
import { Plus, X, Edit, Save, Trash } from 'lucide-react';

interface MedicationQuestionProps {
  question: Question;
  medications: Medication[];
  onChange: (medications: Medication[]) => void;
  required?: boolean;
}

const MedicationQuestion: React.FC<MedicationQuestionProps> = ({ 
  question, 
  medications = [], 
  onChange,
  required = false
}) => {
  const [newMedication, setNewMedication] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const validateMedication = (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 1000;
  };

  const checkDuplicate = (name: string, excludeId?: string): boolean => {
    return medications.some(
      med => med.id !== excludeId && 
      med.name.toLowerCase() === name.trim().toLowerCase()
    );
  };

  const handleAddMedication = () => {
    const isValid = validateMedication(newMedication);
    setIsInvalid(!isValid);
    setIsDuplicate(false);

    if (!isValid) {
      return;
    }

    if (checkDuplicate(newMedication)) {
      setIsDuplicate(true);
      return;
    }
    
    if (medications.length >= 10) {
      alert('Maximum of 10 medications allowed');
      return;
    }
    
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedication.trim()
    };
    
    onChange([...medications, newMed]);
    setNewMedication('');
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  const handleRemoveMedication = (id: string) => {
    onChange(medications.filter(med => med.id !== id));
  };

  const startEditing = (medication: Medication) => {
    setEditingId(medication.id);
    setEditValue(medication.name);
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  const saveEdit = (id: string) => {
    const isValid = validateMedication(editValue);
    setIsInvalid(!isValid);
    setIsDuplicate(false);

    if (!isValid) {
      return;
    }

    if (checkDuplicate(editValue, id)) {
      setIsDuplicate(true);
      return;
    }
    
    onChange(
      medications.map(med => 
        med.id === id ? { ...med, name: editValue.trim() } : med
      )
    );
    
    setEditingId(null);
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  const handleNewMedicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedication(e.target.value);
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  const handleEditValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
    setIsInvalid(false);
    setIsDuplicate(false);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <h3 className="text-gray-700 font-medium mb-2">
          {question.text}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={newMedication}
            onChange={handleNewMedicationChange}
            placeholder="Enter medication name"
            className={`flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${(isInvalid || isDuplicate)
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300'}`}
            minLength={3}
            maxLength={1000}
            required={required && medications.length === 0}
          />
          <button
            type="button"
            onClick={handleAddMedication}
            disabled={medications.length >= 10}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
        
        {isInvalid && (
          <p className="text-red-500 text-xs mt-1 mb-2">
            Medication name must be between 3 and 1000 characters
          </p>
        )}

        {isDuplicate && (
          <p className="text-red-500 text-xs mt-1 mb-2">
            This medication has already been added
          </p>
        )}
        
        {medications.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No medications added yet.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">
              Medications ({medications.length}/10):
            </p>
            {medications.map((medication) => (
              <div 
                key={medication.id}
                className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                {editingId === medication.id ? (
                  <div className="flex flex-grow items-center">
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleEditValueChange}
                      className={`flex-grow px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500
                        ${(isInvalid || isDuplicate)
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300'}`}
                      minLength={3}
                      maxLength={1000}
                    />
                    <div className="flex ml-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(medication.id)}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex-grow">{medication.name}</span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => startEditing(medication)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(medication.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {medications.length >= 10 && (
          <p className="text-xs text-red-500 mt-1">
            Maximum limit of 10 medications reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicationQuestion;