import { useState } from 'react';
import { id, url, viewBox } from 'svg-use-href:./assets/react.svg';
import { ThemedSvg } from 'svg-use-href/react';
import viteLogoUrl from '/vite.svg';
import reactLogoUrl from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogoUrl} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogoUrl} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <ThemedSvg
            iconId={id}
            href={url}
            viewBox={viewBox}
            fill="red"
            className="logo react"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
