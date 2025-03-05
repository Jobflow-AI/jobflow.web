'use client';
import Sidebar from './_components/sidebar';

import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ChatLayoutProps) {
  return (
    <div className="flex gap-2 h-screen w-full bg-black p-4">
      {/* Sidebar or Chat List */}
        <Sidebar />
      {/* Chat Window */}
      <main className="w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
