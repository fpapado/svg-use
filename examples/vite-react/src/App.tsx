import { ThemedSvg } from '@svg-use/react';
import { id, url, viewBox } from './assets/react.svg?svgUse';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
} from 'shared-library';
import './App.css';

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          {/* NOTE: This does not work during development, because Rollup plugins cannot emit in Vite's dev mode */}
          <ThemedSvg
            role="img"
            aria-label="React"
            iconId={id}
            iconUrl={url}
            viewBox={viewBox}
            className="logo react"
          />
        </a>
      </div>
      <p>External icon demos</p>
      <AlertCircle color="orange" role="img" aria-label="Warning" />
      <AlertTriangle />
      <Archive />
      <ArrowRight />
    </>
  );
}

export default App;
