import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import TemplateManager from './components/TemplateManager';
import QuestionDesigner from './components/QuestionDesigner';
import { QuestionsProvider } from './context/QuestionsContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <QuestionsProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/questionnaire/:state" element={<Questionnaire />} />
              <Route path="/template-manager" element={<TemplateManager />} />
              <Route path="/question-designer" element={<QuestionDesigner />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QuestionsProvider>
  );
}

export default App;