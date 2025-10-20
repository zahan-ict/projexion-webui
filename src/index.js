import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>

  /* 
  <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </React.StrictMode> 
  React's strict mode (<React.StrictMode>) in development mode might be causing the useEffect to run twice. 
  This behavior is intentional in React to help identify side effects in your components. 
  */
);
