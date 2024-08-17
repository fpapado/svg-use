import { createThemedExternalSvg, ThemedExternalSvg } from '@svg-use/react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
} from 'shared-library';
import {
  Component as ArrowSvg,
  id,
  url,
  viewBox,
} from './assets/arrow.svg?svgUse';
import './App.css';

const LocalArrowSvg = createThemedExternalSvg({
  id: id,
  url: url,
  viewBox: viewBox,
});

function App() {
  return (
    <>
      <p>Named Component export</p>
      <ArrowSvg />
      <p>ThemedExternalSvg</p>
      <ThemedExternalSvg iconId={id} iconUrl={url} viewBox={viewBox} />
      <p>createThemedExternalSvg</p>
      <LocalArrowSvg />
      <p>External icon demos</p>
      <AlertCircle color="orange" role="img" aria-label="Warning" />
      <AlertTriangle />
      <Archive />
      <ArrowRight />
    </>
  );
}

export default App;
