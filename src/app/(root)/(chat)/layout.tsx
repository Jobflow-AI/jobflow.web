'use client';
import Sidebar from './_components/sidebar';
import { ReactNode, useState, createContext } from 'react';
import { AnimatePresence } from "framer-motion";
import ApplyPanel from './_components/apply-panel';

// Create context to manage panel state across components
export const ApplyPanelContext = createContext({
  isApplyPanelOpen: false,
  setIsApplyPanelOpen: (value: boolean) => {},
  currentJob: null as any
});

interface ChatLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ChatLayoutProps) {
  const [isApplyPanelOpen, setIsApplyPanelOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  return (
    <ApplyPanelContext.Provider value={{ 
      isApplyPanelOpen, 
      setIsApplyPanelOpen,
      currentJob
    }}>
      <div className="flex gap-2 h-screen w-full p-4">
        {/* Sidebar or Chat List */}
        {/* <Sidebar /> */}
        
        {/* Main content area with flexible layout */}
        <div className="flex w-full">
          {/* Chat Window */}
          <main className={`flex-1 transition-all duration-300 ${isApplyPanelOpen ? 'pr-2' : ''}`}>
            {children}
          </main>

          {/* Apply Panel - integrated into the main layout */}
          <AnimatePresence>
            {isApplyPanelOpen && <ApplyPanel />}
          </AnimatePresence>
        </div>
      </div>
    </ApplyPanelContext.Provider>
  );
}
