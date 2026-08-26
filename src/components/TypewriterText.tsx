'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  sparkle?: string;
  className?: string;
  speed?: number;
  pauseTime?: number;
  deleteSpeed?: number;
  highlightWord?: string;
  highlightClass?: string;
}

export default function TypewriterText({
  text,
  sparkle,
  className = '',
  speed = 85,
  pauseTime = 3200,
  deleteSpeed = 40,
  highlightWord,
  highlightClass = 'ref-title-accent'
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText.length < text.length) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (!isDeleting && displayedText.length === text.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && displayedText.length > 0) {
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length - 1));
      }, deleteSpeed);
    } else if (isDeleting && displayedText.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, speed, pauseTime, deleteSpeed]);

  const renderFormattedText = () => {
    if (!highlightWord) {
      return (
        <>
          {displayedText}
          {sparkle && displayedText.length === text.length && (
            <span className="ref-title-sparkle">{sparkle}</span>
          )}
        </>
      );
    }

    // Check if the typed text has reached or contains the highlightWord
    const highlightIndex = text.indexOf(highlightWord);
    if (highlightIndex === -1) {
      return (
        <>
          {displayedText}
          {sparkle && displayedText.length === text.length && (
            <span className="ref-title-sparkle">{sparkle}</span>
          )}
        </>
      );
    }

    const highlightEnd = highlightIndex + highlightWord.length;

    // 1. If we haven't typed up to the highlightWord yet
    if (displayedText.length <= highlightIndex) {
      return <>{displayedText}</>;
    }

    // 2. If we are currently typing inside the highlightWord
    if (displayedText.length < highlightEnd) {
      const beforePart = displayedText.slice(0, highlightIndex);
      const highlightedPart = displayedText.slice(highlightIndex);
      return (
        <>
          {beforePart}
          <span className={highlightClass}>{highlightedPart}</span>
        </>
      );
    }

    // 3. If we have typed past the highlightWord
    const beforePart = displayedText.slice(0, highlightIndex);
    const highlightedPart = displayedText.slice(highlightIndex, highlightEnd);
    const afterPart = displayedText.slice(highlightEnd);

    return (
      <>
        {beforePart}
        <span className={highlightClass}>{highlightedPart}</span>
        {afterPart}
        {sparkle && displayedText.length === text.length && (
          <span className="ref-title-sparkle">{sparkle}</span>
        )}
      </>
    );
  };

  return (
    <span className={`typewriter-header-inline ${className}`}>
      {renderFormattedText()}
      <span className="typewriter-header-cursor">|</span>
    </span>
  );
}
