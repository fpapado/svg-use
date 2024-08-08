import { fromXml } from 'xast-util-from-xml';
import { toXml } from 'xast-util-to-xml';
import { visit, CONTINUE } from 'unist-util-visit';

import { Result } from './result.js';
import { ThemeSubstitutionFn } from './theme.js';

type Root = ReturnType<typeof fromXml>;

/**
 * In order to be compatible with use[href], an SVG needs to have an id. A
 * viewBox is also important, to allow the internal SVG to scale together with
 * the outer one. This function ensures just that.
 */
function makeCompatibleWithUseHref(
  root: Root,
  {
    idCreationFunction,
  }: { idCreationFunction: (existingId?: string) => string },
): Result<{ id: string; viewBox: string; root: Root }, string> {
  const svgRoot = root.children[0];

  if (svgRoot.type !== 'element' || svgRoot.name !== 'svg') {
    return {
      type: 'failure',
      error: 'Could not find root svg element',
    };
  }

  const viewBox = svgRoot.attributes.viewBox;

  if (!viewBox) {
    return {
      type: 'failure',
      error:
        'No viewBox attribute was found on the root svg element. A valid viewBox is required for the svg to render consistently.',
    };
  }

  svgRoot.attributes.id = idCreationFunction(
    svgRoot.attributes.id ?? undefined,
  );

  const id = svgRoot.attributes.id;

  return {
    type: 'success',
    data: {
      id,
      viewBox,
      root,
    },
  };
}

/**
 * Traverse an SVG, and substitute hardcoded color values with other ones
 * (usually custom properties).
 */
function makeThemed(
  root: Root,
  {
    themeSubstitutionFunction,
  }: {
    themeSubstitutionFunction: ThemeSubstitutionFn;
  },
): Root {
  const fixedFillRefs = new Map<string, number>();
  const fixedStrokeRefs = new Map<string, number>();

  // Visit once to collect all fixed values
  visit(root, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }

    const fill = node.attributes.fill;

    // TODO: Consider making this an SVGO plugin, that:
    // - converts <style> to attributes, so they can be picked up/substituted
    // - converts colors (e.g. based on https://svgo.dev/docs/plugins/convert-colors/)
    if (fill && fill !== 'none') {
      // TODO: Decide what to do with other static values
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
    if (fill && substitutions.fills.has(fill)) {
      node.attributes.fill = substitutions.fills.get(fill);
    }

    const stroke = node.attributes.stroke;
    if (stroke && substitutions.strokes.has(stroke)) {
      node.attributes.fill = substitutions.fills.get(stroke);
    }
  });

  return root;
}

// TODO: Split into `makeCompatibleWithUseHref` and `makeThemed`
// TODO: Offer this as a CLI as well; the CLI could
// be an SVGO plugin, so we can reuse some of their infrastructure
export function transformSvg(
  contents: string,
  {
    idCreationFunction,
    themeSubstitutionFunction,
  }: {
    idCreationFunction: (existingId?: string) => string;
    themeSubstitutionFunction: ThemeSubstitutionFn | null;
  },
): Result<
  { id: string; viewBox: string; content: string; warnings?: Array<string> },
  string
> {
  // TODO: ensure viewBox, style to attributes (for themeing, if themeSubstitutionFunction)
  // const initialPass = svgo.optimize(contents, {
  //   plugins: [''],
  // });

  const initialRoot = fromXml(contents);

  const res = makeCompatibleWithUseHref(initialRoot, {
    idCreationFunction,
  });

  if (res.type === 'failure') {
    return res;
  }

  const {
    data: { root, id, viewBox },
  } = res;

  if (!themeSubstitutionFunction) {
    // short-circuit if we have no theme function
    return {
      type: 'success',
      data: {
        id,
        viewBox,
        content: toXml(root, {
          closeEmptyElements: true,
          tightClose: false,
        }),
      },
    };
  }

  const themedRoot = makeThemed(root, { themeSubstitutionFunction });

  return {
    type: 'success',
    data: {
      id,
      viewBox,
      content: toXml(themedRoot, {
        closeEmptyElements: true,
        tightClose: false,
      }),
    },
  };
}
