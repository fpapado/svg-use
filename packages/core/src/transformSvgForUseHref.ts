import svgo, { type CustomPlugin, type PluginConfig } from 'svgo';

import type { Result } from './result.js';
import { XastRoot } from 'svgo/lib/types.js';
import { visit } from 'unist-util-visit';
import { fromXml } from 'xast-util-from-xml';
import { GetThemeSubstitutionFunction } from './theme/makeThemeable.js';
import { GetSvgIdFunction } from './getSvgIdAttribute.js';
import { svgoMakeThemeable } from './theme/svgoMakeThemeable.js';

/** An ad-hoc SVGO plugin, to ensure that the root SVG element has an id. */
const ensureRootId = (getSvgId: GetSvgIdFunction): CustomPlugin => ({
  name: 'ensure-root-id',
  fn: () => ({
    element: {
      enter: (element) => {
        if (element.name !== 'svg') {
          return;
        }

        element.attributes.id = getSvgId({
          existingId: element.attributes.id ?? undefined,
        });
      },
    },
  }),
});

export type UseHrefInfo = {
  id: string;
  viewBox: string;
};

/**
 * In order to be compatible with use[href], an SVG needs to have an id. A
 * viewBox is also important, to allow the internal SVG to scale together with
 * the outer one. This function extracts that information, for downstream use.
 */
function extractDataForUseHref(root: XastRoot): Result<UseHrefInfo, string> {
  let id, viewBox;

  visit(root, (svgRoot) => {
    if (
      svgRoot.type !== 'element' ||
      (svgRoot.type === 'element' && svgRoot.name !== 'svg')
    ) {
      return;
    }

    id = svgRoot.attributes.id;
    viewBox = svgRoot.attributes.viewBox;
  });

  if (!id) {
    return {
      type: 'failure',
      error:
        'No id was found on the svg root. An id is required to reference the element.',
    };
  }

  if (!viewBox) {
    return {
      type: 'failure',
      error:
        'No viewBox attribute was found on the root svg element. A valid viewBox is required for the svg to render consistently before loading.',
    };
  }

  return {
    type: 'success',
    data: {
      id,
      viewBox,
    },
  };
}

export type TransformOptions = {
  /**
   * Specifies an id for the referenced <svg>, set as the id attribute on the
   * root. ids are required in order for use[href] to work.
   *
   * By default, the id attribute will be preserved if present, otherwise a
   * static string id of 'svg-use-id' will be set. Static string ids work _ok_ for
   * the purpose of referencing with use[href], but might clash if you wish to
   * inline the SVGs into the document or a sprite map.
   *
   * Consider using [svgo-loader with the `prefixIds`
   * plugin](https://svgo.dev/docs/plugins/prefix-ids/) prior to this loader, if
   * you want more robust id generation.
   *
   * @defaultValue id attribute if present, static 'use-href-target' otherwise
   */
  getSvgIdAttribute: GetSvgIdFunction;
  /**
   * A function that is used to substituted hardcoded color attributes with
   * different ones (usually custom properties). Receives a sorted map of fills
   * and strokes. Return `null` to skip any theme substitutions.
   *
   * With the default theme function, up to three hardcoded values (each for
   * fill and stroke) are substituted. For example, if an SVG uses a fixed value
   * such as fill="#123123", then a CSS custom property will automatically be
   * extracted and used instead. The static value will be kept as a var()
   * fallback, such as fill="var(--use-href-fill-primary, #123123)".
   *
   * When using a custom function, a prefix is recommended for the properties,
   * to avoid accidentally inheriting styles from the host document (unless
   * that is intended).
   *
   * For SVGs that are meant to be unthemeable (e.g. country flags), or that mix
   * themed values with static ones, you should configure the loader with a
   * different URL query, that uses `null` for the theme function. Refer to the
   * library documentation for guidance.
   *
   * @defaultValue {@link defaultThemeSubstitution}
   */
  getThemeSubstitutions: GetThemeSubstitutionFunction | null;
};

export function transformSvgForUseHref(
  contents: string,
  { getSvgIdAttribute, getThemeSubstitutions }: TransformOptions,
): Result<UseHrefInfo & { content: string }, string> {
  const transformed = svgo.optimize(contents, {
    plugins: [
      // convert width/height in the root to viewBox. This ensures better scaling.
      // TODO: Keep our ears open, in case this causes issues for some users.
      'removeDimensions',
      ensureRootId(getSvgIdAttribute),
      // convert inline styles to attributes; useful as a setup for the themeing
      // transform, which only looks at attributes
      getThemeSubstitutions !== null ? 'convertStyleToAttrs' : undefined,
      getThemeSubstitutions !== null
        ? svgoMakeThemeable(getThemeSubstitutions)
        : undefined,
    ].filter((a) => a !== undefined) as PluginConfig[],
  });

  const res = extractDataForUseHref(fromXml(transformed.data) as XastRoot);

  if (res.type === 'failure') {
    return res;
  }

  return {
    type: 'success',
    data: {
      id: res.data.id,
      viewBox: res.data.viewBox,
      content: transformed.data,
    },
  };
}
