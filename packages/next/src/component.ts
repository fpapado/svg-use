import { createElement } from 'react';
import type { CSSProperties, SVGAttributes } from 'react';

export interface ThemeProps {
  color?: string;
  colorSecondary?: string;
  colorTertiary?: string;
}

export interface FactoryProps {
  url: string;
  id: string;
  viewBox: string;
}

type SvgProps = ThemeProps & SVGAttributes<SVGSVGElement>;

/**
 * An RSC-compatible factory for SVG use-href components. Unlike
 * `createThemedExternalSvg` from `@svg-use/react`, this factory uses no React
 * context or effects, so it is safe to call at module scope in React Server
 * Components and in modules without a `'use client'` directive.
 *
 * The returned component renders `<svg><use href="…#id" /></svg>` with the
 * three default theme custom properties applied as inline style.
 *
 * For runtime path-rewriting or cross-origin runtime checks, use
 * `@svg-use/react`'s `createThemedExternalSvg` in a `'use client'` component
 * instead.
 */
export function createThemedSvgUse({ url, id, viewBox }: FactoryProps) {
  const hrefWithId = `${url}#${id}`;

  return function ThemedSvgUse({
    color,
    colorSecondary,
    colorTertiary,
    style,
    ...rest
  }: SvgProps) {
    const styleWithCustomProperties = {
      ...style,
      '--svg-use-color-primary': color,
      '--svg-use-color-secondary': colorSecondary,
      '--svg-use-color-tertiary': colorTertiary,
    } as CSSProperties;
    return createElement(
      'svg',
      { ...rest, viewBox, style: styleWithCustomProperties },
      createElement('use', { href: hrefWithId }),
    );
  };
}
