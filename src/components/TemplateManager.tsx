import React, { useState } from 'react';
import { useQuestions } from '../context/QuestionsContext';
import { QuestionTemplate } from '../types';
import { Save, AlertTriangle } from 'lucide-react';

const TemplateManager: React.FC = () => {
  const { templates, updateTemplate } = useQuestions();
  const [selectedState, setSelectedState] = useState<string>(templates[0].state);
  const [templateJson, setTemplateJson] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Find the template for the selected state
  const stateTemplate = templates.find(template => template.state === selectedState);

  // Load template when state changes
  React.useEffect(() => {
    if (stateTemplate) {
      setTemplateJson(JSON.stringify(stateTemplate, null, 2));
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [selectedState, stateTemplate]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateJson(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSaveTemplate = () => {
    try {
      const parsedTemplate = JSON.parse(templateJson) as QuestionTemplate;
      
      // Basic validation
      if (!parsedTemplate.state || !parsedTemplate.questions) {
        throw new Error('Template must include state and questions properties');
      }
      
      // Validate that state matches selectedState
      if (parsedTemplate.state !== selectedState) {
        throw new Error(`State in template (${parsedTemplate.state}) must match selected state (${selectedState})`);
      }
      
      // Save the template
      updateTemplate(selectedState, parsedTemplate);
      setSuccessMessage('Template updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Template Manager</h2>
        
        <div className="mb-4">
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select State
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {templates.map(template => (
              <option key={template.state} value={template.state}>
                {template.state}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="template-json" className="block text-sm font-medium text-gray-700 mb-2">
            Edit Template JSON
          </label>
          <textarea
            id="template-json"
            value={templateJson}
            onChange={handleTemplateChange}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        <button
          onClick={handleSaveTemplate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </button>
      </div>
    </div>
  );
};

export default TemplateManager;