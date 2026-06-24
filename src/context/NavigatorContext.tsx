'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigatorContextType {
  isOpen: boolean;
  openNavigator: () => void;
  closeNavigator: () => void;
  toggleNavigator: () => void;
}

const NavigatorContext = createContext<NavigatorContextType | undefined>(undefined);

export function NavigatorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openNavigator = () => setIsOpen(true);
  const closeNavigator = () => setIsOpen(false);
  const toggleNavigator = () => setIsOpen((prev) => !prev);

  // Close Navigator on page transition or ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeNavigator();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NavigatorContext.Provider value={{ isOpen, openNavigator, closeNavigator, toggleNavigator }}>
      {children}
    </NavigatorContext.Provider>
  );
}

export function useNavigator() {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
}
