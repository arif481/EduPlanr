/**
 * Login Page
 * Authentication with Google, email/password, and anonymous options
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@/components/ui';
import {
  signInWithGoogle,
  signInWithEmail,
  signInAnonymouslyUser,
} from '@/services/authService';
import { parseErrorMessage } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setLoadingType('email');

    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoadingType('google');

    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setLoadingType('anonymous');

    try {
      await signInAnonymouslyUser();
      toast.success('Welcome! Your data will be saved temporarily.');
      router.push('/dashboard');
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 to-dark-950" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan">
                <span className="text-2xl font-bold text-white font-display">E</span>
              </div>
              <span className="text-3xl font-bold gradient-text font-display">EduPlanr</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 font-display">
              Welcome Back,
              <br />
              <span className="gradient-text">Future Scholar</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-md">
              Continue your learning journey. Your notes, schedules, and progress
              are waiting for you.
            </p>

            {/* Feature highlights */}
            <div className="mt-12 space-y-4">
              {[
                'AI-powered study recommendations',
                'Track your progress in real-time',
                'Sync across all your devices',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-lg font-bold text-white font-display">E</span>
            </div>
            <span className="text-2xl font-bold gradient-text font-display">EduPlanr</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Sign in</h2>
          <p className="text-gray-400 mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-neon-cyan hover:underline">
              Sign up
            </Link>
          </p>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleGoogleLogin}
              isLoading={loadingType === 'google'}
              disabled={isLoading}
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleAnonymousLogin}
              isLoading={loadingType === 'anonymous'}
              disabled={isLoading}
              leftIcon={<UserIcon className="w-5 h-5" />}
            >
              Try without account
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-sm text-gray-500">or continue with email</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          {/* Email login form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent-primary focus:ring-neon-cyan focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>

              <Link
                href="/auth/reset-password"
                className="text-sm text-neon-cyan hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loadingType === 'email'}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
