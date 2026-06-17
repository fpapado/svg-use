'use client';
import { configContext, type Config } from '@svg-use/react';

const svgUseConfig: Config = {
  runtimeChecksEnabled: process.env.NODE_ENV === 'development',
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <configContext.Provider value={svgUseConfig}>
      {children}
    </configContext.Provider>
  );
}
