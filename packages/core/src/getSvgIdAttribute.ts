export type GetSvgIdFunction = ({
  existingId,
}: {
  existingId?: string;
}) => string;

/**
 * The default id function. Uses a fixed id, regardless of context or a
 * pre-existing id. Useful for consistency, but might lead to clashes if you are
 * inlining SVGs in the document.
 *
 * @category Primary function defaults
 */
export const defaultGetSvgIdAttribute: GetSvgIdFunction = () =>
  'use-href-target';
