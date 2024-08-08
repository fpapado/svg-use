import * as arrowSvg from './arrow.svg?svgUseHref';
import { createRoot } from 'react-dom/client';
import { createThemedExternalSvg } from 'svg-use-href/react';

const ArrowSvg = createThemedExternalSvg({
  iconId: arrowSvg.id,
  href: arrowSvg.url,
  viewBox: arrowSvg.viewBox,
});

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

createRoot(rootEl).render(
  <button>
    <ArrowSvg />
  </button>,
);
