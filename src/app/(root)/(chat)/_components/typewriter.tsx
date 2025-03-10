import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterPlaceholderProps {
  placeholders: string[];
  className?: string;
  cursorClassName?: string;
  onFocus?: () => void;
  onUserType?: () => void;
}

const TypewriterPlaceholder: React.FC<TypewriterPlaceholderProps> = ({
  placeholders,
  className,
  cursorClassName,
  onFocus,
  onUserType
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const [userHasTyped, setUserHasTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userHasTyped) return;

    const currentPlaceholder = placeholders[currentPlaceholderIndex];
    
    if (isTypingPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsTypingPaused(false);
        setIsDeleting(true);
      }, 2000); 
      
      return () => clearTimeout(pauseTimeout);
    }
    
    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setCurrentPlaceholderIndex((prevIndex) => 
          (prevIndex + 1) % placeholders.length
        );
      } else {
        const deleteTimeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50); // Backspace speed
        
        return () => clearTimeout(deleteTimeout);
      }
    } else {
      if (displayText === currentPlaceholder) {
        setIsTypingPaused(true);
      } else {
        const typeTimeout = setTimeout(() => {
          setDisplayText(currentPlaceholder.slice(0, displayText.length + 1));
        }, 100); // Typing speed
        
        return () => clearTimeout(typeTimeout);
      }
    }
  }, [displayText, isDeleting, currentPlaceholderIndex, placeholders, isTypingPaused, userHasTyped]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userHasTyped && e.target.value) {
      setUserHasTyped(true);
      onUserType && onUserType();
    } else if (e.target.value === '') {
      setUserHasTyped(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "w-full bg-transparent text-white outline-none",
          className
        )}
        onChange={handleInputChange}
        onFocus={() => {
          onFocus && onFocus();
        }}
        placeholder=""
      />
      
      {!userHasTyped && (
        <div className="absolute top-0 left-0 pointer-events-none flex items-center text-gray-400">
          <span>{displayText}</span>
          <span className={cn("inline-block w-0.5 h-5 bg-white/70 animate-blink ml-0.5", cursorClassName)}></span>
        </div>
      )}
    </div>
  );
};

export default TypewriterPlaceholder;