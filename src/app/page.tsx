/**
 * Landing Page
 * Public homepage with app introduction and call to action
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

const features = [
  {
    icon: CalendarDaysIcon,
    title: 'Smart Scheduling',
    description: 'AI-powered study schedule that adapts to your deadlines and learning pace.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Syllabus Tracking',
    description: 'Track your progress through courses with visual completion indicators.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'AI Study Tutor',
    description: 'Get instant help with concepts, flashcards, and practice questions.',
  },
  {
    icon: ChartBarIcon,
    title: 'Progress Analytics',
    description: 'Visualize your study habits and optimize your learning patterns.',
  },
  {
    icon: SparklesIcon,
    title: 'Smart Notes',
    description: 'Rich text notes with AI-powered summaries and organization.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Study with peace of mind.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan">
            <span className="text-lg font-bold text-white font-display">E</span>
          </div>
          <span className="text-2xl font-bold gradient-text font-display">EduPlanr</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-dark-800/50 border border-dark-600/50">
              <SparklesIcon className="w-5 h-5 text-neon-cyan" />
              <span className="text-sm text-gray-300">AI-Powered Study Planning</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-display leading-tight">
              Study Smarter,
              <br />
              <span className="gradient-text">Not Harder</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Your intelligent companion for academic success. Plan your studies, 
              track progress, and get AI-powered help whenever you need it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 mt-16 flex-wrap">
              {[
                { value: '10K+', label: 'Active Students' },
                { value: '50K+', label: 'Study Sessions' },
                { value: '95%', label: 'Goal Completion' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-neon-cyan font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass-card neon-border p-2 rounded-3xl max-w-4xl mx-auto">
              <div className="bg-dark-900 rounded-2xl h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                    <CalendarDaysIcon className="w-10 h-10 text-neon-cyan" />
                  </div>
                  <p className="text-gray-400">Dashboard Preview</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-4 top-1/4 glass-card p-4 rounded-xl hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Progress</p>
                  <p className="text-xs text-neon-green">+15% this week</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-4 top-1/3 glass-card p-4 rounded-xl hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Tutor</p>
                  <p className="text-xs text-gray-400">Ready to help</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
              Everything You Need to Excel
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powerful features designed to help you stay organized, focused, and achieve your academic goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card neon-border p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Ready to Transform Your Studies?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of students who are already studying smarter with EduPlanr. 
            Start your free trial today.
          </p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="text-lg px-10">
              Get Started for Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 lg:px-12 border-t border-dark-700/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-sm font-bold text-white font-display">E</span>
            </div>
            <span className="text-lg font-bold text-white font-display">EduPlanr</span>
          </div>
          
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} EduPlanr. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
