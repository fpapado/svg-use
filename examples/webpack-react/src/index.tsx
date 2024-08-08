import * as arrowSvg from './arrow.svg?svgUseHref';
import { createRoot } from 'react-dom/client';
import { createThemedExternalSvg } from 'svg-use-href/react';

const ArrowSvg = createThemedExternalSvg({
  id: arrowSvg.id,
  url: arrowSvg.url,
  viewBox: arrowSvg.viewBox,
});

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

createRoot(rootEl).render(
  <div>
    <ArrowSvg />
    {/* FIXME: add types for this */}
    {/* <arrowSvg.Component /> */}
  </div>,
);
