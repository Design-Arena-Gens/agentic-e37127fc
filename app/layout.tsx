import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sora2 Narrative Studio',
  description: 'Transform long-form scripts into cinematic videos with an agentic pipeline powered by Sora2.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-12">{children}</div>
      </body>
    </html>
  );
}
