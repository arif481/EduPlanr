/**
 * Main Layout Component
 * Wraps authenticated pages with sidebar and header
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main content */}
      <motion.main
        className={cn(
          'pt-16 min-h-screen',
          'transition-all duration-300',
          sidebarCollapsed ? 'pl-20' : 'pl-[260px]'
        )}
        initial={false}
        animate={{ paddingLeft: sidebarCollapsed ? 80 : 260 }}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
      </div>
    </div>
  );
}
