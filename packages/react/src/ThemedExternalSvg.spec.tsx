import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@testing-library/react';

import {
  ThemedExternalSvg,
  configContext,
  createThemedExternalSvg,
  type Config,
} from './ThemedExternalSvg.js';
import { createRef } from 'react';

describe('ThemedExternalSVG', () => {
  it('can render an SVG via an id and href', () => {
    render(
      <ThemedExternalSvg
        role="img"
        aria-label="Confirm"
        iconId="my-id"
        iconUrl="/my-icon.svg"
        viewBox="0 0 24 24"
      />,
    );

    expect(screen.getByRole('img', { name: 'Confirm' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Confirm' }).querySelector('use'),
    ).toHaveAttribute('href', '/my-icon.svg#my-id');
  });

  it('can pass ref to SVG', () => {
    const ref = createRef<SVGSVGElement>();

    render(
      <ThemedExternalSvg
        role="presentation"
        aria-label="Confirm"
        iconId="my-id"
        iconUrl="/my-icon.svg"
        viewBox="0 0 24 24"
        ref={ref}
      />,
    );

    expect(ref.current).toBeDefined();
  });
});

describe('createThemedExternalSvg', () => {
  it('can render an SVG via an id and href', () => {
    const Component = createThemedExternalSvg({
      id: 'my-id',
      url: '/my-icon.svg',
      viewBox: '0 0 24 24',
    });

    render(<Component role="img" aria-label="Confirm" />);

    expect(screen.getByRole('img', { name: 'Confirm' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Confirm' }).querySelector('use'),
    ).toHaveAttribute('href', '/my-icon.svg#my-id');
  });

  it('can pass ref to SVG', () => {
    const ref = createRef<SVGSVGElement>();

    const Component = createThemedExternalSvg({
      id: 'my-id',
      url: '/my-icon.svg',
      viewBox: '0 0 24 24',
    });

    render(<Component role="img" aria-label="Confirm" ref={ref} />);

    expect(ref.current).toBeDefined();
  });
});

describe('configContext', () => {
  it('can be configued to warn on mismatched origins', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(
      <configContext.Provider value={{ runtimeChecksEnabled: true }}>
        <ThemedExternalSvg
          role="img"
          aria-label="Confirm"
          iconId="my-id"
          iconUrl="https://my-cdn.com/my-icon.svg"
          viewBox="0 0 24 24"
        />
      </configContext.Provider>,
    );

    expect(consoleWarnSpy).toHaveBeenCalledExactlyOnceWith(
      'The SVG you are trying to load is on the https://my-cdn.com origin, but the current site is http://localhost:3000. SVG use[href] only works with same-origin URLs, and there is no mechanism to make them available cross-origin. Your options are to either self-host the SVG under your own origin, or to set up a proxy.',
    );

    consoleWarnSpy.mockRestore();
  });

  it('can rewrite the URL for an SVG', () => {
    const rewritePath = vi.fn<NonNullable<Config['rewritePath']>>(
      (pathOrHref) => {
        const url = URL.parse(pathOrHref);

        if (!url) {
          return pathOrHref;
        }

        return new URL('svg-proxy' + url.pathname, 'https://example.com').href;
      },
    );

    render(
      <configContext.Provider value={{ rewritePath }}>
        <ThemedExternalSvg
          role="img"
          aria-label="Confirm"
          iconId="my-id"
          iconUrl="https://my-cdn.com/my-icon.svg"
          viewBox="0 0 24 24"
        />
      </configContext.Provider>,
    );

    expect(rewritePath).toHaveBeenCalledExactlyOnceWith(
      'https://my-cdn.com/my-icon.svg',
    );
    expect(screen.getByRole('img', { name: 'Confirm' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Confirm' }).querySelector('use'),
    ).toHaveAttribute(
      'href',
      'https://example.com/svg-proxy/my-icon.svg#my-id',
    );
  });
});
