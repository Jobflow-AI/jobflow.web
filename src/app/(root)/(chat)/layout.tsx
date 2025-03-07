'use client';
import Sidebar from './_components/sidebar';
import { ReactNode, useState, createContext } from 'react';
import { AnimatePresence } from "framer-motion";
import ApplyPanel from './_components/apply-panel';
import ChatHeader from './_components/chatHeader';

// AppContext manages overall app state including sidebar and apply panel state
export const AppContext = createContext({
  isApplyPanelOpen: false,
  setIsApplyPanelOpen: (value: boolean) => {},
  currentJob: null as any,
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (value: boolean) => {}
});

// ApplyPanelContext manages only the apply panel state
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AppContext.Provider value={{
      isApplyPanelOpen,
      setIsApplyPanelOpen,
      currentJob,
      isSidebarCollapsed,
      setIsSidebarCollapsed
    }}>
      <ApplyPanelContext.Provider value={{
        isApplyPanelOpen,
        setIsApplyPanelOpen,
        currentJob
      }}>
        <div className="h-screen w-full bg-black p-4 relative">
          {/* Sidebar component */}
          <Sidebar />

          {/* Main content area with header and content */}
          {/* Main content area with content */}
          <div className={`flex flex-col h-full transition-all duration-500 ease-in-out ${
            isSidebarCollapsed ? 'ml-0 items-center' : 'ml-[300px]'
          }`}>
            {/* Main content container */}
            <div className="flex w-full h-full overflow-hidden justify-center">
              {/* Chat Window */}
              <main className={`flex-1 overflow-hidden transition-all duration-300 max-w-4xl ${
                isApplyPanelOpen ? 'pr-2' : ''
              }`}>
                {children}
              </main>

              {/* Apply Panel */}
              <AnimatePresence>
                {isApplyPanelOpen && <ApplyPanel />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ApplyPanelContext.Provider>
    </AppContext.Provider>
  );
}
