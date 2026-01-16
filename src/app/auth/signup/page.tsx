/**
 * Sign Up Page
 * New user registration with Google and email options
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@/components/ui';
import { signInWithGoogle, signUpWithEmail } from '@/services/authService';
import { parseErrorMessage, isValidEmail } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoadingType('email');

    try {
      await signUpWithEmail(email, password, name);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(parseErrorMessage(error));
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setLoadingType('google');

    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
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
      {/* Left side - Form */}
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

          <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
          <p className="text-gray-400 mb-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-neon-cyan hover:underline">
              Sign in
            </Link>
          </p>

          {/* Google signup */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoogleSignup}
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
            Sign up with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-sm text-gray-500">or continue with email</span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          {/* Email signup form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-5 h-5" />}
              error={errors.name}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              error={errors.password}
              hint="At least 8 characters"
              disabled={isLoading}
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loadingType === 'email'}
              disabled={isLoading}
            >
              Create account
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
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

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-dark-900 to-dark-950" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-purple">
                <span className="text-2xl font-bold text-white font-display">E</span>
              </div>
              <span className="text-3xl font-bold gradient-text font-display">EduPlanr</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 font-display">
              Start Your
              <br />
              <span className="gradient-text">Learning Journey</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-md">
              Join thousands of students who are already achieving their academic
              goals with smart planning and AI assistance.
            </p>

            {/* Benefits */}
            <div className="mt-12 space-y-4">
              {[
                'Free forever plan available',
                'No credit card required',
                'Set up in under 2 minutes',
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
