import { createThemedExternalSvg, ThemedExternalSvg } from '@svg-use/react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
} from 'shared-library';
import * as arrowSvg from './arrow.svg?svgUse';

const LocalArrowSvg = createThemedExternalSvg({
  id: arrowSvg.id,
  url: arrowSvg.url,
  viewBox: arrowSvg.viewBox,
});

function App() {
  return (
    <>
      <p>Component export</p>
      {/* @ts-expect-error -- We do not have types for Component yet */}
      <arrowSvg.Component />
      <p>ThemedExternalSvg</p>
      <ThemedExternalSvg
        iconId={arrowSvg.id}
        iconUrl={arrowSvg.url}
        viewBox={arrowSvg.viewBox}
      />
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
