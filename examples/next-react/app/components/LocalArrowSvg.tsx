'use client'

import {
  id,
  url,
  viewBox,
} from '../assets/arrow.svg?extract';
import { createThemedExternalSvg } from "@svg-use/react";

export const LocalArrowSvg = createThemedExternalSvg({
  id: id,
  url: url,
  viewBox: viewBox,
});
