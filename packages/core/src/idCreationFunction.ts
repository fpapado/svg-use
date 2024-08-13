export type IdCreationFunction = ({
  filename,
  existingId,
}: {
  filename: string;
  existingId?: string;
}) => string;
