import { ThemedExternalSvg } from '@svg-use/react';
import { LocalArrowSvg } from './components/LocalArrowSvg';
import { SharedIcons } from './components/SharedIcons';
import {
  Component as ArrowSvg,
  id,
  url,
  viewBox,
} from './assets/arrow.svg?extract';
import { Component as UnthemedArrowSvg } from './assets/arrow.svg?extract&unthemed';

export default function Page() {
  return (
    <>
      <p>Named Component export (RSC-compatible via createThemedSvgUse)</p>
      <ArrowSvg color="green" />

      <p>ThemedExternalSvg (from @svg-use/react, rendered as a Client Component)</p>
      <ThemedExternalSvg color="blue" iconId={id} iconUrl={url} viewBox={viewBox} />

      <p>createThemedExternalSvg (explicit 'use client' wrapper)</p>
      <LocalArrowSvg color="purple" />

      <p>Unthemed (original colours preserved)</p>
      <UnthemedArrowSvg />

      <p>External icon demos (shared-library, wrapped in 'use client')</p>
      <SharedIcons />
    </>
  );
}
