import type { CSSProperties, HTMLAttributes } from 'react';
import { createContext, forwardRef, useContext } from 'react';
import { runtimeChecks } from './runtimeChecks.dev.js';

type ConfigContextValue = {
  /**
   * Used to rewrite paths at runtime. This is most useful to account for
   * hosting your assets on a CDN. Because svg[use] does not support CORS, it is
   * not possible to reference external SVGs from a CDN. Hosting static assets
   * and scripts separately from an application origin is relatively common. One
   * possible workaround is to proxy the SVGs from your origin to the CDN. In
   * order to achieve that, you need a way to rewrite the URLs.
   *
   * Note: This does not set up any proxying; your application/server code is
   * responsible for that.
   *
   * TODO: Consider how different bundlers provide things here; can people rely
   * on this to work?
   */
  rewritePath: (pathOrHref: string) => string;
};

export const configContext = createContext<ConfigContextValue | undefined>(
  undefined,
);

export interface ThemeProps {
  stroke?: string;
  strokeSecondary?: string;
  strokeTertiary?: string;
  fill?: string;
  fillSecondary?: string;
  fillTertiary?: string;
}

export interface BaseProps {
  /**
   * The URL of the SVG, to be included in svg > use[href]. Note that this URL
   * must be on the same origin as the site, otherwise no SVG will be displayed.
   * There is no mechanism for cross-origin svg[use].
   */
  iconUrl: string;
  /** The id of the referent icon, in the destination SVG. */
  iconId: string;
  /** The viewBox of the referent SVG; used to ensure the same scaling. */
  viewBox: string;
}

export type Props = BaseProps & ThemeProps & HTMLAttributes<SVGSVGElement>;

export const ThemedSvg = forwardRef<SVGSVGElement, Props>(
  (
    {
      iconUrl,
      iconId,
      viewBox,
      stroke,
      strokeSecondary: strokeSecondary,
      strokeTertiary: strokeTertiary,
      fill,
      fillSecondary,
      fillTertiary,
      style,
      ...rest
    },
    ref,
  ) => {
    const config = useContext(configContext);

    const transformedUrl = config?.rewritePath(iconUrl) ?? iconUrl;
    runtimeChecks(transformedUrl);

    const hrefWithId = `${iconUrl}#${iconId}`;

    /**
     * These are all tied to the default theme. It might be beneficial to define
     * the theme as types, for posterity.
     */
    const styleWithCustomProps = {
      ...style,
      '--use-href-stroke-primary': stroke,
      '--use-href-stroke-secondary': strokeSecondary,
      '--use-href-stroke-tertiary': strokeTertiary,
      '--use-href-fill-primary': fill,
      '--use-href-fill-secondary': fillSecondary,
      '--use-href-fill-tertiary': fillTertiary,
    } as CSSProperties;

    return (
      <svg {...rest} viewBox={viewBox} style={styleWithCustomProps} ref={ref}>
        <use href={hrefWithId} />
      </svg>
    );
  },
);

export type FactoryProps = { url: string; id: string; viewBox: string };

/**
 * Component factory for ThemedExternalSvg. You can use this to organise
 * modules.
 */
export const createThemedExternalSvg =
  ({ url, id, viewBox }: FactoryProps) =>
  (props: ThemeProps & HTMLAttributes<SVGSVGElement>): JSX.Element => (
    <ThemedSvg {...props} iconUrl={url} iconId={id} viewBox={viewBox} />
  );
