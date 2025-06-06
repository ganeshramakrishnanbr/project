import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import TemplateManager from './components/TemplateManager';
import QuestionDesigner from './components/QuestionDesigner';
import Navbar from './components/Navbar';

console.log('App component is initializing (restored)...'); // Debug log

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/questionnaire/:state" element={<Questionnaire />} />
              <Route path="/template-manager" element={<TemplateManager />} />
              <Route path="/question-designer" element={<QuestionDesigner />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}
