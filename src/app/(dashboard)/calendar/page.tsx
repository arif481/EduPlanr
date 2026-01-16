/**
 * Calendar Page
 * Study schedule visualization and session management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ClockIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
} from 'date-fns';
import { Card, CardHeader, Button, Badge, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import { StudySession, SessionType } from '@/types';

// Mock data for sessions
const mockSessions: StudySession[] = [
  {
    id: '1',
    userId: '1',
    title: 'Calculus Review',
    description: 'Integration techniques',
    subjectId: '1',
    syllabusId: null,
    topicId: null,
    startTime: new Date(),
    endTime: addDays(new Date(), 0),
    isCompleted: false,
    notes: '',
    type: 'study',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Physics Lab',
    description: 'Quantum mechanics',
    subjectId: '2',
    syllabusId: null,
    topicId: null,
    startTime: addDays(new Date(), 1),
    endTime: addDays(new Date(), 1),
    isCompleted: false,
    notes: '',
    type: 'study',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    title: 'Midterm Exam',
    description: 'Mathematics',
    subjectId: '1',
    syllabusId: null,
    topicId: null,
    startTime: addDays(new Date(), 5),
    endTime: addDays(new Date(), 5),
    isCompleted: false,
    notes: '',
    type: 'exam',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sessionTypeColors: Record<SessionType, string> = {
  study: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  review: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  break: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  exam: 'bg-red-500/20 text-red-400 border-red-500/30',
  assignment: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sessions, setSessions] = useState<StudySession[]>(mockSessions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get sessions for a specific day
  const getSessionsForDay = (date: Date) => {
    return sessions.filter((session) => isSameDay(session.startTime, date));
  };

  // Get sessions for selected date
  const selectedDateSessions = selectedDate ? getSessionsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Calendar</h1>
          <p className="text-gray-400 mt-1">
            Plan and track your study sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Session
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const daySessions = getSessionsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'relative p-2 min-h-[80px] rounded-xl transition-all text-left',
                      'hover:bg-dark-700/50',
                      !isCurrentMonth && 'opacity-40',
                      isSelected && 'bg-dark-700/50 ring-2 ring-neon-cyan/50',
                      isDayToday && !isSelected && 'bg-dark-700/30'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm',
                        isDayToday && 'bg-neon-cyan text-dark-900 font-bold',
                        !isDayToday && isCurrentMonth && 'text-gray-200',
                        !isDayToday && !isCurrentMonth && 'text-gray-500'
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Session indicators */}
                    {daySessions.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {daySessions.slice(0, 2).map((session) => (
                          <div
                            key={session.id}
                            className={cn(
                              'text-xs px-1.5 py-0.5 rounded truncate border',
                              sessionTypeColors[session.type]
                            )}
                          >
                            {session.title}
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <div className="text-xs text-gray-400 px-1.5">
                            +{daySessions.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Selected date details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="sticky top-24">
            <CardHeader
              title={selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
              subtitle={`${selectedDateSessions.length} session${selectedDateSessions.length !== 1 ? 's' : ''}`}
              icon={<ClockIcon className="w-5 h-5" />}
            />

            {selectedDateSessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      'p-4 rounded-xl border',
                      sessionTypeColors[session.type]
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{session.title}</h4>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {session.description}
                        </p>
                      </div>
                      <Badge variant="default" size="sm">
                        {session.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {format(session.startTime, 'h:mm a')}
                      </span>
                      {session.subjectId && (
                        <span className="flex items-center gap-1">
                          <AcademicCapIcon className="w-4 h-4" />
                          Subject
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
                  <ClockIcon className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-4">No sessions scheduled</p>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(true)}
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Add Session
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Add session modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Study Session"
        description="Schedule a new study session"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Session creation form would go here. For now, sessions are loaded from mock data.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>
              Create Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
