import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/dashboard.css';
import './styles/shell.css';
import './styles/session.css';
import './styles/course-modal.css';
import './styles/mcp-auth.css';
import './styles/platform-marketplace.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
