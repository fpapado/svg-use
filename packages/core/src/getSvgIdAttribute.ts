export type GetSvgIdFunction = ({
  existingId,
}: {
  existingId?: string;
}) => string;

export const defaultGetSvgIdAttribute: GetSvgIdFunction = () =>
  'use-href-target';
