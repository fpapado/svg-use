import type { CSSProperties, HTMLAttributes } from 'react';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { runtimeChecks } from './runtimeChecks.dev.js';

export type Config = {
  /**
   * Used to rewrite paths at runtime. This is most useful to account for
   * hosting your assets on a CDN.
   *
   * Because svg[use] does not support CORS, it is not possible to reference
   * external SVGs from a CDN. Hosting static assets and scripts separately from
   * an application origin is relatively common, so this poses a problem. One
   * possible workaround is to proxy the SVGs via your origin to the CDN. In
   * order to achieve that, you need a way to rewrite the URLs.
   *
   * Note: This does not set up any proxying; your application/server code is
   * responsible for that.
   */
  rewritePath?: (pathOrHref: string) => string;

  /**
   * Toggles runtime checks, which help catch common pitfalls with using external
   * SVGs, such as needing to be on the same origin.
   *
   * @defaultValue true
   */
  runtimeChecksEnabled?: boolean;
};

/**
 * A context that you can use to customise the runtime behavior of
 * `ThemedExternalSvg`. Because `ThemedExternalSvg` is usually a compilation
 * target, this allows you to inject configuration without changing the signature
 * of modules.
 *
 * @category Primary exports
 *
 * @example
 * ```tsx
 * import { configContext, type Config } from '@svg-use/react';
 *
 * const config: Config = {
 *   // Add any config options here
 * };
 *
 * const AppRoot = () => {
 *   return (
 *     <configContext.Provider value={config}>
 *       {\/* The rest of the application *\/}
 *     </configContext.Provider>
 *   );
 * };
 * ```
 */
export const configContext = createContext<Config>({
  runtimeChecksEnabled: true,
});

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
   * The URL of the SVG, to be included in `svg > use[href]`. Note that this URL
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

/**
 * The main React component, which wires up `svg > use[href]`, as well as the
 * default theme (custom properties) from `@svg-use/core`. Accepts props for
 * setting the color.
 *
 * @category Primary exports
 */
export const ThemedExternalSvg = forwardRef<SVGSVGElement, Props>(
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

    const transformedUrl = useMemo(
      () => (config.rewritePath ? config.rewritePath(iconUrl) : iconUrl),
      [config.rewritePath, iconUrl],
    );

    useEffect(() => {
      if (config.runtimeChecksEnabled) {
        runtimeChecks(transformedUrl);
      }
    }, [config.runtimeChecksEnabled, transformedUrl]);

    const hrefWithId = `${iconUrl}#${iconId}`;

    /**
     * These are all tied to the default theme. It might be beneficial to define
     * the theme as types, for posterity.
     */
    const styleWithCustomProperties = {
      ...style,
      '--use-href-stroke-primary': stroke,
      '--use-href-stroke-secondary': strokeSecondary,
      '--use-href-stroke-tertiary': strokeTertiary,
      '--use-href-fill-primary': fill,
      '--use-href-fill-secondary': fillSecondary,
      '--use-href-fill-tertiary': fillTertiary,
    } as CSSProperties;

    return (
      <svg
        {...rest}
        viewBox={viewBox}
        style={styleWithCustomProperties}
        ref={ref}
      >
        <use href={hrefWithId} />
      </svg>
    );
  },
);

export type FactoryProps = { url: string; id: string; viewBox: string };

/**
 * A component factory for {@link ThemedExternalSvg}. Useful for module organisation,
 * and as a target for `@svg-use/core`'s `createJsModule`.
 *
 * @category Primary exports
 */
export const createThemedExternalSvg =
  ({ url, id, viewBox }: FactoryProps) =>
  (props: ThemeProps & HTMLAttributes<SVGSVGElement>): JSX.Element => (
    <ThemedExternalSvg {...props} iconUrl={url} iconId={id} viewBox={viewBox} />
  );
