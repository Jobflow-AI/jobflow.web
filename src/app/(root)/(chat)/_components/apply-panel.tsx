"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react"
import { ApplyPanelContext } from "../layout"

const ApplyPanel = () => {
  const { isApplyPanelOpen, setIsApplyPanelOpen, currentJob } = useContext(ApplyPanelContext)
  const [isLoading, setIsLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("This website cannot be displayed in an embedded view.")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Animation variants for the panel
  const panelVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { 
      width: "550px", 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      width: 0, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  // Get the apply link from the current job or use a fallback
  const applyLink = currentJob?.applyLink || "https://www.workatastartup.com/jobs/71534"
  
  // Create proxy URL
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(applyLink)}`;

  const handleIframeLoad = () => {
    try {
      // Check if we can access the iframe content
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      
      if (!iframeDoc || !iframeDoc.body) {
        setIframeError(true);
        setErrorMessage("Cannot access the website content due to security restrictions.");
      } else if (iframeDoc.body.innerHTML === '') {
        setIframeError(true);
        setErrorMessage("The website returned empty content.");
      } else {
        setIsLoading(false);
        setIframeError(false);
      }
    } catch (error) {
      console.error("Iframe access error:", error);
      setIframeError(true);
      setErrorMessage("Cannot access the website content due to security restrictions.");
    }
    
    // Stop the loading state regardless
    setIsLoading(false);
  }

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
    setErrorMessage("Failed to load the website content.");
  }

  // Add error detection
  useEffect(() => {
    // Reset states when the panel opens or URL changes
    setIsLoading(true);
    setIframeError(false);
    
    const timer = setTimeout(() => {
      if (isLoading) {
        setIframeError(true);
        setIsLoading(false);
        setErrorMessage("Loading timed out. The website may be blocking embedding.");
      }
    }, 10000); 
    
    return () => clearTimeout(timer);
  }, [applyLink, isApplyPanelOpen]);

  // Open in new tab
  const openInNewTab = () => {
    window.open(applyLink, '_blank', 'noopener,noreferrer');
  }

  // Try refreshing the iframe
  const handleRefresh = () => {
    setIsLoading(true);
    setIframeError(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = proxyUrl;
    }
  }

  return (
    <motion.div 
      className="h-full bg-zinc-800 border-l border-zinc-700 overflow-hidden rounded-lg flex flex-col"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header with controls */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsApplyPanelOpen(false)}
            className="text-zinc-400 hover:text-white mr-4"
          >
            <X size={20} />
          </button>
          <h2 className="text-white font-medium truncate">
            {currentJob?.name ? `Apply at ${currentJob.name}` : 'Apply Panel'}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-700"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={openInNewTab}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-700"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
      
      {/* Browser content */}
      <div className="flex-1 relative">
        {/* Loading indicator */}
        {isLoading && !iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-70 z-10">
            <div className="flex flex-col items-center">
              <RefreshCw size={24} className="text-[#b9ff2c] animate-spin mb-2" />
              <p className="text-zinc-300 text-sm">Loading application page...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {iframeError ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="bg-zinc-700/30 rounded-lg p-8 max-w-md text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle size={40} className="text-amber-400" />
              </div>
              <h3 className="text-white text-xl font-medium mb-3">Cannot Display Application Page</h3>
              <p className="text-zinc-300 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={openInNewTab}
                className="bg-[#b9ff2c] text-zinc-800 font-medium px-6 py-3 rounded-lg inline-flex items-center hover:bg-opacity-90 transition-colors"
              >
                Open in New Tab <ExternalLink className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Embedded iframe */
          <iframe 
            ref={iframeRef}
            id="apply-iframe"
            src={proxyUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Application Page"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </motion.div>
  )
}

export default ApplyPanel