import { createThemedExternalSvg, ThemedExternalSvg } from '@svg-use/react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
  Settings,
  SettingsWithFillOptions,
} from 'shared-library';
import {
  Component as ArrowSvg,
  id,
  url,
  viewBox,
} from './assets/arrow.svg?svgUse';
import { Component as UnthemedArrowSvg } from './assets/arrow.svg?svgUse&noTheme';

const LocalArrowSvg = createThemedExternalSvg({
  id: id,
  url: url,
  viewBox: viewBox,
});

function App() {
  return (
    <>
      <p>Named Component export</p>
      <ArrowSvg color="green" />
      <p>ThemedExternalSvg</p>
      <ThemedExternalSvg
        color="blue"
        iconId={id}
        iconUrl={url}
        viewBox={viewBox}
      />
      <p>createThemedExternalSvg</p>
      <LocalArrowSvg color="purple" />
      <p>Unthemed</p>
      <UnthemedArrowSvg color="purple" />
      <p>External icon demos</p>
      <AlertCircle color="orange" role="img" aria-label="Warning" />
      <AlertTriangle />
      <Archive />
      <ArrowRight />
      <p>Icon without fill</p>
      <Settings color="slateblue" />
      <p>Icon without fill but with forced fill</p>
      <SettingsWithFillOptions color="slateblue" />
    </>
  );
}

export default App;
