//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/authContext.tsx';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider> 
    </BrowserRouter>
  
)
