import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthContextProvider} from './context/AuthContext'
import {ClassroomContextProvider} from './context/ClassroomContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ClassroomContextProvider>
          <App />
      </ClassroomContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
