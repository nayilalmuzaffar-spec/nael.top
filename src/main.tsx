import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PoemsProvider } from './lib/poemsContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PoemsProvider>
      <App />
    </PoemsProvider>
  </StrictMode>
);
