import * as arrowSvg from './arrow.svg?svgUse';
import { createRoot } from 'react-dom/client';
import { createThemedExternalSvg } from '@svg-use/react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
} from 'shared-library';

const InlineArrowSvg = createThemedExternalSvg({
  id: arrowSvg.id,
  url: arrowSvg.url,
  viewBox: arrowSvg.viewBox,
});

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

createRoot(rootEl).render(
  <div>
    <InlineArrowSvg />
    {/* FIXME: add types for this */}
    {/* <arrowSvg.Component /> */}
    <ArrowRight />
    <AlertCircle />
    <AlertTriangle />
    <Archive />
  </div>,
);
