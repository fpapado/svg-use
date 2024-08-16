import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { configContext, type Config } from '@svg-use/react';

const svgUseConfig: Config = {
  runtimeChecksEnabled: process.env.NODE_ENV === 'development',
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <configContext.Provider value={svgUseConfig}>
      <App />
    </configContext.Provider>
  </React.StrictMode>,
);
