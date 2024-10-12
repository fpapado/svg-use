/** Development-only checks on the supplied parameters */
export const runtimeChecks = (href: string) => {
  const base = window !== undefined ? window.location.href : undefined;
  const url = urlParse(href, base);

  if (!url) {
    console.warn(
      `Could not parse href ${href} as URL. The SVG will not be displayed correctly. This might imply a loader misconfiguration in your bundler. Ensure that the SVG that you are trying to reference is loaded via its URL.`,
    );
    return;
  }

  if (window !== undefined && window.location.origin !== url.origin) {
    console.warn(
      `The SVG you are trying to load is on the ${url.origin} origin, but the current site is ${window.location.origin}. SVG use[href] only works with same-origin URLs, and there is no mechanism to make them available cross-origin. Your options are to either self-host the SVG under your own origin, or to set up a proxy.`,
    );
  }
};

const urlParse = (href: string, base?: string): URL | null => {
  const hasUrlParse = 'parse' in URL;
  if (hasUrlParse) {
    //@see https://developer.mozilla.org/en-US/docs/Web/API/URL/parse_static
    return URL.parse(href, base);
  }

  try {
    return new URL(href, base);
  } catch {
    return null;
  }
};
