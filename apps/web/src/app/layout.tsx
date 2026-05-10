import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { AppShell } from '@web/components/shared/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillX | AI-Powered Skill Barter & Mentorship',
  description: 'Exchange skills, find mentors, and grow with SkillX.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <AppShell>
            {children}
          </AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
