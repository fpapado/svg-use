import dedent from 'dedent';

/**
 * Creates a JS module (as a string), that exposes all relevant information to
 * embed the SVG via use[href]. Also exposes a React component, for convenience.
 * This module is what our runtime eventually sees.
 */
export const createJsModule = ({
  url,
  id,
  viewBox,
}: {
  url: string;
  id: string;
  viewBox: string;
}): string => {
  return dedent`
import {createThemedExternalSvg} from 'svg-use-href/react';

export const url = ${url};
export const id = ${id};
export const viewBox = ${viewBox};

export const Component = createThemedExternalSvg({url, id, viewBox});`;
};
