import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const states = [
    { code: 'CT', name: 'Connecticut' },
    { code: 'CA', name: 'California' },
    { code: 'FL', name: 'Florida' },
    { code: 'NJ', name: 'New Jersey' }
  ];

  const handleStateSelect = (stateCode: string) => {
    navigate(`/questionnaire/${stateCode}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Reflexive Questionnaire</h1>
        <p className="text-gray-600 mb-6">Please select your state to begin the questionnaire. Each state has specific reflexive questions tailored to its requirements.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {states.map((state) => (
            <button
              key={state.code}
              onClick={() => handleStateSelect(state.code)}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Map className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{state.name}</h3>
                  <p className="text-sm text-gray-500">State Code: {state.code}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;