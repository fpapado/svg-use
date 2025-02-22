import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { configContext, type Config } from '@svg-use/react';

const svgUseConfig: Config = {
  runtimeChecksEnabled: import.meta.env.DEV,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <configContext.Provider value={svgUseConfig}>
      <App />
    </configContext.Provider>
  </React.StrictMode>,
);
