export type Result<TData, TError> =
  | { type: 'success'; data: TData }
  | { type: 'failure'; error: TError };
