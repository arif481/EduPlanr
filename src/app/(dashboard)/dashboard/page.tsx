/**
 * Dashboard Page
 * Main overview with stats, recent activities, and quick actions
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlusIcon,
  PlayIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Card, CardHeader, Button, ProgressBar, CircularProgress, Badge } from '@/components/ui';
import { useAuthStore, useChatStore } from '@/store';
import { useTimer } from '@/hooks';
import { formatTimer, formatDuration, getGreeting } from '@/lib/utils';

// Quick stats data (would come from API in production)
const mockStats = {
  studyHoursToday: 2.5,
  studyHoursGoal: 4,
  tasksCompleted: 5,
  tasksPending: 3,
  currentStreak: 7,
  weeklyProgress: 68,
};

const recentSessions = [
  { id: 1, subject: 'Mathematics', topic: 'Calculus - Integration', duration: 45, completedAt: new Date() },
  { id: 2, subject: 'Physics', topic: 'Quantum Mechanics', duration: 60, completedAt: new Date(Date.now() - 3600000) },
  { id: 3, subject: 'Computer Science', topic: 'Data Structures', duration: 30, completedAt: new Date(Date.now() - 7200000) },
];

const upcomingTasks = [
  { id: 1, title: 'Complete Chapter 5 exercises', subject: 'Mathematics', dueIn: '2 hours', priority: 'high' },
  { id: 2, title: 'Review lecture notes', subject: 'Physics', dueIn: 'Tomorrow', priority: 'medium' },
  { id: 3, title: 'Submit assignment', subject: 'Computer Science', dueIn: '3 days', priority: 'low' },
];

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { openChat } = useChatStore();
  const timer = useTimer();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (mockStats.studyHoursToday / mockStats.studyHoursGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            {getGreeting()}, {profile?.displayName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<SparklesIcon className="w-5 h-5" />}
            onClick={openChat}
          >
            Ask AI Tutor
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlayIcon className="w-5 h-5" />}
            onClick={() => timer.startStudySession(45)}
          >
            Start Session
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient" className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Today's Study</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockStats.studyHoursToday}h
                  <span className="text-sm font-normal text-gray-400">
                    {' '}/ {mockStats.studyHoursGoal}h
                  </span>
                </p>
              </div>
              <CircularProgress 
                value={progressPercentage} 
                size={60} 
                strokeWidth={6}
                variant={progressPercentage >= 100 ? 'success' : 'default'}
              />
            </div>
            <ProgressBar value={progressPercentage} className="mt-4" size="sm" />
          </Card>
        </motion.div>

        {/* Tasks completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="gradient" className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockStats.tasksCompleted}
                  <span className="text-sm font-normal text-gray-400">
                    {' '}/ {mockStats.tasksCompleted + mockStats.tasksPending}
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-neon-green" />
              </div>
            </div>
            <p className="text-sm text-neon-green mt-4 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +2 from yesterday
            </p>
          </Card>
        </motion.div>

        {/* Study streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Study Streak</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockStats.currentStreak} days 🔥
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-neon-orange/20 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-neon-orange" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Keep it up! Your best was 14 days
            </p>
          </Card>
        </motion.div>

        {/* Weekly progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="gradient" className="h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Weekly Goal</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {mockStats.weeklyProgress}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-neon-purple" />
              </div>
            </div>
            <ProgressBar 
              value={mockStats.weeklyProgress} 
              className="mt-4" 
              size="sm" 
              variant={mockStats.weeklyProgress >= 80 ? 'success' : 'default'}
            />
          </Card>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study timer / Active session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader
              title={timer.isRunning ? 'Active Session' : 'Quick Start'}
              subtitle={timer.isRunning ? 'Focus mode' : 'Begin a study session'}
              icon={<ClockIcon className="w-5 h-5" />}
            />

            {timer.isRunning ? (
              <div className="text-center py-8">
                <div className="text-6xl font-bold font-mono text-white mb-4">
                  {formatTimer(timer.remaining)}
                </div>
                <p className="text-gray-400 mb-6">
                  {timer.sessionType === 'study' ? '📚 Study session' : '☕ Break time'}
                </p>
                <ProgressBar 
                  value={timer.progress} 
                  className="max-w-md mx-auto mb-6"
                  variant={timer.sessionType === 'study' ? 'default' : 'success'}
                />
                <div className="flex items-center justify-center gap-3">
                  {timer.isPaused ? (
                    <Button variant="primary" onClick={timer.resumeTimer}>
                      Resume
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={timer.pauseTimer}>
                      Pause
                    </Button>
                  )}
                  <Button variant="ghost" onClick={timer.stopTimer}>
                    End Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[15, 25, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => timer.startStudySession(minutes)}
                    className="p-4 rounded-xl bg-dark-700/50 border border-dark-600/50 hover:border-neon-cyan/50 hover:bg-dark-700 transition-all group"
                  >
                    <p className="text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {minutes}
                    </p>
                    <p className="text-sm text-gray-400">minutes</p>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Upcoming tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader
              title="Upcoming Tasks"
              subtitle={`${mockStats.tasksPending} pending`}
              icon={<CalendarDaysIcon className="w-5 h-5" />}
              action={
                <Link href="/tasks">
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              }
            />

            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-dark-700/30 border border-dark-600/30 hover:border-dark-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{task.subject}</p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'red'
                          : task.priority === 'medium'
                          ? 'yellow'
                          : 'default'
                      }
                      size="sm"
                    >
                      {task.dueIn}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="secondary" fullWidth className="mt-4" leftIcon={<PlusIcon className="w-4 h-4" />}>
              Add Task
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Recent sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader
            title="Recent Sessions"
            subtitle="Your study activity"
            icon={<BookOpenIcon className="w-5 h-5" />}
            action={
              <Link href="/calendar">
                <Button variant="ghost" size="sm">View calendar</Button>
              </Link>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-dark-600/50">
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Topic</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-dark-600/30 last:border-0">
                    <td className="py-4">
                      <span className="text-white font-medium">{session.subject}</span>
                    </td>
                    <td className="py-4 text-gray-300">{session.topic}</td>
                    <td className="py-4">
                      <Badge variant="neon">{formatDuration(session.duration)}</Badge>
                    </td>
                    <td className="py-4 text-gray-400">
                      {session.completedAt.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
