import svgo, { type CustomPlugin, type PluginConfig } from 'svgo';

import type { Result } from './result.js';
import type { ThemeSubstitutionFn } from './theme.js';
import { XastRoot } from 'svgo/lib/types.js';
import { visit, CONTINUE } from 'unist-util-visit';
import { fromXml } from 'xast-util-from-xml';

/** An ad-hoc SVGO plugin, to ensure that the root SVG element has an id. */
const ensureRootId = (params: {
  idCreationFunction: (existingId?: string) => string;
}): CustomPlugin => ({
  name: 'ensure-root-id',
  fn: () => ({
    element: {
      enter: (element) => {
        if (element.name !== 'svg') {
          return;
        }

        element.attributes.id = params.idCreationFunction(
          element.attributes.id ?? undefined,
        );
      },
    },
  }),
});

const makeThemeable = ({
  themeSubstitutionFunction,
}: {
  themeSubstitutionFunction: ThemeSubstitutionFn;
}): CustomPlugin => ({
  name: 'make-themeable',
  fn: (root) => {
    // XastRoot does not line up with Root in the types, but they are both xast
    // roots, so the cast seems safe. makeThemeable does its own visiting of the
    // tree (in two passes), so we do not use SVGO's visitor.
    xastMakeThemeable(root, themeSubstitutionFunction);
    return null;
  },
});

/**
 * Traverse an SVG as xast, and substitute hardcoded color values with other
 * ones (usually custom properties).
 */
function xastMakeThemeable(
  root: XastRoot,
  themeSubstitutionFunction: ThemeSubstitutionFn,
): XastRoot {
  const fixedFillRefs = new Map<string, number>();
  const fixedStrokeRefs = new Map<string, number>();

  // Visit once to collect all fixed values
  visit(root, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }

    const fill = node.attributes.fill;

    if (fill && fill !== 'none') {
      // TODO: We should parse var(), to check fallbacks
      // For now, we should have a simplistic "value or var()" parser; using a full-blown CSS value parser might be better, but...
      fixedFillRefs.set(fill, (fixedFillRefs.get(fill) ?? 0) + 1);
    }

    const stroke = node.attributes.stroke;

    if (stroke && stroke !== 'none') {
      fixedStrokeRefs.set(stroke, (fixedStrokeRefs.get(stroke) ?? 0) + 1);
    }
  });

  const sortedFills = new Map(
    Array.from(fixedFillRefs.entries()).sort(([, a], [, b]) => a - b),
  );

  const sortedStrokes = new Map(
    Array.from(fixedStrokeRefs.entries()).sort(([, a], [, b]) => a - b),
  );

  const substitutions = themeSubstitutionFunction({
    fills: sortedFills,
    strokes: sortedStrokes,
  });

  // Visit again, to substitute
  visit(root, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }

    const fill = node.attributes.fill;
    const substitutionFill = substitutions.fills.get(fill);

    if (fill && substitutionFill) {
      node.attributes.fill = substitutionFill;
    }

    const stroke = node.attributes.stroke;
    const substitutionStroke = substitutions.strokes.get(stroke);

    if (stroke && substitutionStroke) {
      node.attributes.stroke = substitutionStroke;
    }
  });

  return root;
}

type UseHrefInfo = {
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
        'No viewBox attribute was found on the root svg element. A valid viewBox is required for the svg to render consistently.',
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

export function transformSvgForUseHref(
  contents: string,
  {
    idCreationFunction,
    themeSubstitutionFunction,
  }: {
    idCreationFunction: (existingId?: string) => string;
    themeSubstitutionFunction: ThemeSubstitutionFn | null;
  },
): Result<UseHrefInfo & { content: string }, string> {
  const transformed = svgo.optimize(contents, {
    plugins: [
      // convert width/height in the root to viewBox. This ensures better scaling.
      // TODO: Keep our ears open, in case this causes issues for some users.
      'removeDimensions',
      ensureRootId({ idCreationFunction }),
      // convert inline styles to attributes; useful as a setup for the themeing
      // transform, which only looks at attributes
      themeSubstitutionFunction !== null ? 'convertStyleToAttrs' : undefined,
      themeSubstitutionFunction !== null
        ? makeThemeable({ themeSubstitutionFunction })
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
