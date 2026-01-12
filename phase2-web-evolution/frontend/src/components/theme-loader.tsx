'use client';

import { useEffect } from 'react';

export function ThemeLoader() {
  useEffect(() => {
    // Load the saved gradient from localStorage on component mount
    const savedGradient = localStorage.getItem('selectedGradient');

    if (savedGradient) {
      // Apply the saved gradient to the body
      document.body.style.background = `var(--gradient-${savedGradient})`;
      document.body.style.backgroundClip = 'border-box';
    }
  }, []);

  return null; // This component doesn't render anything
}