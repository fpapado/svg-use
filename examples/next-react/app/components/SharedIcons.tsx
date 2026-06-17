'use client';

import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRight,
  Settings,
  SettingsWithFillOptions,
} from 'shared-library';

export function SharedIcons() {
  return (
    <>
      <AlertCircle color="orange" role="img" aria-label="Warning" />
      <AlertTriangle />
      <Archive />
      <ArrowRight />
      <p>Icon without fill</p>
      <Settings color="slateblue" />
      <p>Icon without fill but with forced fill</p>
      <SettingsWithFillOptions color="slateblue" />
    </>
  );
}
