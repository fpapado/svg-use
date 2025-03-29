import { CONTINUE, EXIT, visit } from 'unist-util-visit';
import type { Root } from 'xast';

export type GetThemeSubstitutionFunction = (counts: {
  fills: Map<string, number>;
  strokes: Map<string, number>;
}) => {
  fills: Map<string, string>;
  strokes: Map<string, string>;
};

export type XastMakeThemeableOptions = {
  /**
   * If no fills or strokes are found in the SVG, then this specified fill will
   * be added to the root SVG element. This is useful for SVGs that do not
   * specify a fill or stroke, and would otherwise default to black. This
   * addition is done prior to the `getThemeSubstitutions` transform.
   */
  fallbackRootFill?: string;
};

/**
 * Traverse an SVG as xast, and substitute hardcoded color values with other
 * ones (usually custom properties).
 */
export function xastMakeThemeable(
  root: Root,
  getThemeSubstitutions: GetThemeSubstitutionFunction,
  options?: XastMakeThemeableOptions,
): Root {
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

  // If no elements have a fill or stroke, then set any specified fallback
  // fill on the root
  if (
    options?.fallbackRootFill !== undefined &&
    fixedFillRefs.size === 0 &&
    fixedStrokeRefs.size === 0
  ) {
    let hasBeenVisited = false;
    visit(root, (node) => {
      if (node.type === 'element' && node.name === 'svg') {
        if (!node.attributes.fill && !node.attributes.stroke) {
          node.attributes.fill = options.fallbackRootFill;
          hasBeenVisited = true;
        }
        return EXIT;
      }

      return CONTINUE;
    });

    if (hasBeenVisited) {
      return xastMakeThemeable(root, getThemeSubstitutions, options);
    }
  }

  const sortedFills = new Map(
    Array.from(fixedFillRefs.entries()).sort(([, a], [, b]) => a - b),
  );

  const sortedStrokes = new Map(
    Array.from(fixedStrokeRefs.entries()).sort(([, a], [, b]) => a - b),
  );

  const substitutions = getThemeSubstitutions({
    fills: sortedFills,
    strokes: sortedStrokes,
  });

  // Visit again, to substitute
  visit(root, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }

    const fill = node.attributes.fill;

    if (fill) {
      const substitutionFill = substitutions.fills.get(fill);

      if (substitutionFill) {
        node.attributes.fill = substitutionFill;
      }
    }

    const stroke = node.attributes.stroke;

    if (stroke) {
      const substitutionStroke = substitutions.strokes.get(stroke);

      if (substitutionStroke) {
        node.attributes.stroke = substitutionStroke;
      }
    }
  });

  return root;
}
