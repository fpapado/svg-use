import { createThemedExternalSvg } from '@svg-use/react';

export const url = new URL('./alert-circle.svg', import.meta.url);
export const id = 'use-href-target';
export const viewBox = '0 0 24 24';

export const Component = createThemedExternalSvg({ url, id, viewBox });
