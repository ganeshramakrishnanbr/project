import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ActivitySquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ActivitySquare className="h-6 w-6" />
              <span className="font-semibold text-xl">Reflexive Questions</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/template-manager" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/template-manager' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Template Manager
            </Link>
            <Link 
              to="/question-designer" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/question-designer' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500'
              }`}
            >
              Question Designer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;