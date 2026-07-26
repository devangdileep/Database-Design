import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopSphere - Multi-Vendor RDBMS Shopping Platform',
  description: 'Production-Grade Single Page Web UI with Supabase Relational Database Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#070a12] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
