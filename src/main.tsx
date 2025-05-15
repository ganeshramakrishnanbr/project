import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { QuestionsProvider } from './context/QuestionsContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('Attempting to render full App into rootElement:', rootElement);
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <QuestionsProvider>
            <App />
          </QuestionsProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('Full App rendering initiated.');
  } catch (e) {
    console.error('Error during ReactDOM.createRoot().render():', e);
    rootElement.innerHTML = '<div style="color: red; padding: 20px;"><h1>Critical React Rendering Error</h1><p>Could not render the application. Check console.</p></div>';
  }
} else {
  console.error('CRITICAL: Root element with ID "root" not found in HTML.');
  document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>CRITICAL: Root element not found.</h1><p>The application cannot start because the HTML is missing the &lt;div id="root"&gt;&lt;/div&gt;.</p></div>';
}
