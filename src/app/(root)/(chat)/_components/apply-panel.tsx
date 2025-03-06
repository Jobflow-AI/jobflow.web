"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, RefreshCw, ExternalLink, AlertTriangle, ArrowLeft, ArrowRight, Globe } from "lucide-react"
import { ApplyPanelContext } from "../layout"

const ApplyPanel = () => {
  const { isApplyPanelOpen, setIsApplyPanelOpen, currentJob } = useContext(ApplyPanelContext)
  const [isLoading, setIsLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("This website cannot be displayed in an embedded view.")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])
  const [currentUrlIndex, setCurrentUrlIndex] = useState(-1)
  const [currentUrl, setCurrentUrl] = useState("")
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
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
  const applyLink = currentJob?.applyLink || "https://www.workatastartup.com/jobs/71291"
  
  // Create proxy URL
  const getProxyUrl = (url: string) => `/api/proxy?url=${encodeURIComponent(url)}`;

  // Initialize navigation history when panel opens
  useEffect(() => {
    if (isApplyPanelOpen) {
      setNavigationHistory([applyLink]);
      setCurrentUrlIndex(0);
      setCurrentUrl(applyLink);
      setIsLoading(true);
      setIframeError(false);
    }
    
    return () => {
      // Clear any pending timeouts when component unmounts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isApplyPanelOpen, applyLink]);

  // Update current URL when navigation history changes
  useEffect(() => {
    if (currentUrlIndex >= 0 && navigationHistory.length > currentUrlIndex) {
      setCurrentUrl(navigationHistory[currentUrlIndex]);
    }
  }, [navigationHistory, currentUrlIndex]);

  const handleIframeLoad = () => {
    // Clear any pending timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
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
        
        // Track navigation within the iframe
        try {
          // Add event listeners to track link clicks in the iframe
          const links = iframeDoc.querySelectorAll('a');
          links.forEach(link => {
            // Remove existing event listeners to avoid duplicates
            const newLink = link.cloneNode(true);
            link.parentNode?.replaceChild(newLink, link);
            
            newLink.addEventListener('click', (e) => {
              const href = (newLink as HTMLAnchorElement).getAttribute('href');
              if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                e.preventDefault();
                
                // Construct absolute URL if it's relative
                let fullUrl = href;
                if (!href.startsWith('http')) {
                  const baseUrl = new URL(navigationHistory[currentUrlIndex]);
                  fullUrl = new URL(href, baseUrl).toString();
                }
                
                // Update navigation history
                const newHistory = [...navigationHistory.slice(0, currentUrlIndex + 1), fullUrl];
                setNavigationHistory(newHistory);
                setCurrentUrlIndex(newHistory.length - 1);
                
                // Navigate to the new URL
                navigateToUrl(fullUrl);
              }
            });
          });
          
          // Also handle form submissions
          const forms = iframeDoc.querySelectorAll('form');
          forms.forEach(form => {
            // Remove existing event listeners to avoid duplicates
            const newForm = form.cloneNode(true);
            form.parentNode?.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
              e.preventDefault();
              
              // Show a message that form submission is not supported in embedded view
              setIframeError(true);
              setErrorMessage("Form submission is not supported in embedded view. Please open in a new tab to submit forms.");
            });
          });
        } catch (e) {
          console.error("Error setting up iframe navigation tracking:", e);
        }
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
    // Reset states when URL changes
    if (currentUrl) {
      setIsLoading(true);
      setIframeError(false);
      
      // Set a timeout to detect if loading takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIframeError(true);
          setIsLoading(false);
          setErrorMessage("Loading timed out. The website may be blocking embedding.");
        }
      }, 8000); // Longer timeout for slower connections
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [currentUrl]);

  // Open current URL in new tab
  const openInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  }

  // Navigate to a specific URL
  const navigateToUrl = (url: string) => {
    setIsLoading(true);
    setIframeError(false);
    setCurrentUrl(url);
    
    if (iframeRef.current) {
      iframeRef.current.src = getProxyUrl(url);
    }
  }

  // Try refreshing the iframe
  const handleRefresh = () => {
    navigateToUrl(currentUrl);
  }

  // Go back in navigation history
  const goBack = () => {
    if (currentUrlIndex > 0) {
      setCurrentUrlIndex(currentUrlIndex - 1);
      navigateToUrl(navigationHistory[currentUrlIndex - 1]);
    }
  }

  // Go forward in navigation history
  const goForward = () => {
    if (currentUrlIndex < navigationHistory.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      navigateToUrl(navigationHistory[currentUrlIndex + 1]);
    }
  }

  // Get domain name for display
  const getDomainName = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch (e) {
      return url;
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
          <h2 className="text-white font-medium truncate flex items-center">
            {currentUrl && (
              <>
                <Globe size={16} className="mr-2 text-zinc-400" />
                <span className="text-zinc-300">{getDomainName(currentUrl)}</span>
              </>
            )}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={goBack}
            disabled={currentUrlIndex <= 0}
            className={`text-zinc-400 hover:text-white p-1 rounded-full ${currentUrlIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'}`}
            title="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={goForward}
            disabled={currentUrlIndex >= navigationHistory.length - 1}
            className={`text-zinc-400 hover:text-white p-1 rounded-full ${currentUrlIndex >= navigationHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'}`}
            title="Go forward"
          >
            <ArrowRight size={16} />
          </button>
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
              <p className="text-zinc-300 text-sm">Loading {getDomainName(currentUrl)}...</p>
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
              <div className="flex flex-col space-y-3">
                <button
                  onClick={openInNewTab}
                  className="bg-[#b9ff2c] text-zinc-800 font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-opacity-90 transition-colors"
                >
                  Open in New Tab <ExternalLink className="ml-2 w-4 h-4" />
                </button>
                
                {currentUrlIndex > 0 && (
                  <button
                    onClick={goBack}
                    className="bg-transparent border border-zinc-600 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-zinc-700 transition-colors"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Embedded iframe */
          <iframe 
            ref={iframeRef}
            id="apply-iframe"
            src={getProxyUrl(navigationHistory[currentUrlIndex] || applyLink)}
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