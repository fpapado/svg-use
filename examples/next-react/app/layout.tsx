import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'svg-use next example',
  description: 'Demonstrates @svg-use/next with Next.js + Turbopack',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
